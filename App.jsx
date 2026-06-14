
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ScrollView,
} from "react-native";

const levels = Array.from({ length: 50 }, (_, i) => {
  const data = [
    ["🍎","APPLE"],["🍌","BANANA"],["🐶","DOG"],["🐱","CAT"],["🚗","CAR"],
    ["🚌","BUS"],["✈️","PLANE"],["🐘","ELEPHANT"],["🦒","GIRAFFE"],["🐟","FISH"],
    ["🍇","GRAPES"],["🍊","ORANGE"],["🏠","HOUSE"],["🏫","SCHOOL"],["⚽","BALL"],
    ["🏀","BASKETBALL"],["🦅","EAGLE"],["🦉","OWL"],["🌳","TREE"],["🌙","MOON"],
    ["🌞","SUN"],["🌧️","RAIN"],["🍕","PIZZA"],["🍔","BURGER"],["🥕","CARROT"],
    ["🍅","TOMATO"],["🐄","COW"],["🐓","CHICKEN"],["🌹","ROSE"],["🌻","SUNFLOWER"],
    ["👕","SHIRT"],["👖","PANTS"],["👟","SHOES"],["🚲","BICYCLE"],["🐧","PENGUIN"],
    ["🐬","DOLPHIN"],["🦈","SHARK"],["🌍","EARTH"],["⭐","STAR"],["🔺","TRIANGLE"],
    ["⭕","CIRCLE"],["1️⃣","ONE"],["2️⃣","TWO"],["3️⃣","THREE"],["🔴","RED"],
    ["🔵","BLUE"],["🟢","GREEN"],["🟡","YELLOW"],["🦋","BUTTERFLY"],["🐝","BEE"]
  ];
  return { id: i + 1, emoji: data[i][0], answer: data[i][1] };
});

export default function App() {
  const [screen, setScreen] = useState("home");
  const [currentLevel, setCurrentLevel] = useState(0);
  const [unlocked, setUnlocked] = useState(1);
  const [score, setScore] = useState(0);

  const startLevel = (index) => {
    setCurrentLevel(index);
    setScreen("game");
  };

  const getOptions = () => {
    const correct = levels[currentLevel].answer;
    const wrong = levels
      .filter(x => x.answer !== correct)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(x => x.answer);

    return [correct, ...wrong].sort(() => Math.random() - 0.5);
  };

  const checkAnswer = (word) => {
    if (word === levels[currentLevel].answer) {
      const newScore = score + 10;
      setScore(newScore);

      if (currentLevel + 2 > unlocked) {
        setUnlocked(Math.min(currentLevel + 2, 50));
      }

      if (currentLevel === 49) {
        setScreen("winner");
      } else {
        Alert.alert("🎉 Great Job!", "Level Complete!");
        setCurrentLevel(currentLevel + 1);
      }
    } else {
      Alert.alert("❌ Oops!", "Try Again");
    }
  };

  if (screen === "home") {
    return (
      <SafeAreaView style={styles.home}>
        <Text style={styles.logo}>🌈 Kids Match Adventure</Text>
        <Text style={styles.sub}>Learn & Play</Text>
        <Text style={styles.hero}>🦁 🎈 ⭐ 🐼 🌟</Text>

        <TouchableOpacity
          style={styles.playBtn}
          onPress={() => setScreen("levels")}
        >
          <Text style={styles.playText}>PLAY NOW</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (screen === "levels") {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.heading}>🎯 Select Level</Text>
        <Text style={styles.score}>⭐ Score: {score}</Text>

        <FlatList
          data={levels}
          numColumns={5}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => {
            const locked = item.id > unlocked;
            return (
              <TouchableOpacity
                disabled={locked}
                style={[styles.levelBox, locked && styles.locked]}
                onPress={() => startLevel(index)}
              >
                <Text style={styles.levelText}>
                  {locked ? "🔒" : item.id}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </SafeAreaView>
    );
  }

  if (screen === "winner") {
    return (
      <SafeAreaView style={styles.winner}>
        <Text style={styles.trophy}>🏆</Text>
        <Text style={styles.winTitle}>Congratulations!</Text>
        <Text style={styles.winText}>You completed all 50 levels.</Text>
        <Text style={styles.winText}>Final Score: {score}</Text>

        <TouchableOpacity
          style={styles.playBtn}
          onPress={() => {
            setCurrentLevel(0);
            setUnlocked(1);
            setScore(0);
            setScreen("home");
          }}
        >
          <Text style={styles.playText}>PLAY AGAIN</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const options = getOptions();

  return (
    <SafeAreaView style={styles.game}>
      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        <Text style={styles.levelTitle}>
          Level {levels[currentLevel].id}
        </Text>

        <Text style={styles.bigEmoji}>
          {levels[currentLevel].emoji}
        </Text>

        <Text style={styles.question}>
          Match the correct word
        </Text>

        {options.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={() => checkAnswer(item)}
          >
            <Text style={styles.optionText}>{item}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => setScreen("levels")}
        >
          <Text style={styles.backText}>⬅ Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  home:{
    flex:1,
    backgroundColor:"#6C63FF",
    justifyContent:"center",
    alignItems:"center",
    padding:20,
  },
  logo:{fontSize:34,fontWeight:"bold",color:"#fff",textAlign:"center"},
  sub:{fontSize:20,color:"#fff",marginTop:10},
  hero:{fontSize:48,marginVertical:25},
  playBtn:{
    backgroundColor:"#FFD93D",
    paddingHorizontal:35,
    paddingVertical:15,
    borderRadius:30,
  },
  playText:{fontSize:20,fontWeight:"bold"},
  container:{flex:1,backgroundColor:"#F4F7FF",padding:10},
  heading:{fontSize:28,fontWeight:"bold",textAlign:"center",marginVertical:10},
  score:{fontSize:18,textAlign:"center",marginBottom:10},
  levelBox:{
    flex:1,
    margin:6,
    height:60,
    backgroundColor:"#6C63FF",
    borderRadius:15,
    justifyContent:"center",
    alignItems:"center",
  },
  locked:{backgroundColor:"#BDBDBD"},
  levelText:{color:"#fff",fontWeight:"bold",fontSize:18},
  game:{
    flex:1,
    backgroundColor:"#FFF8E7",
    paddingTop:30,
  },
  levelTitle:{fontSize:28,fontWeight:"bold"},
  bigEmoji:{fontSize:120,marginVertical:20},
  question:{fontSize:22,marginBottom:20},
  option:{
    width:"85%",
    backgroundColor:"#6C63FF",
    padding:16,
    borderRadius:20,
    marginVertical:8,
  },
  optionText:{
    color:"#fff",
    textAlign:"center",
    fontSize:20,
    fontWeight:"bold",
  },
  backBtn:{
    marginTop:20,
    backgroundColor:"#FF8A65",
    padding:12,
    borderRadius:15,
  },
  backText:{color:"#fff",fontWeight:"bold"},
  winner:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"#E8F5E9",
    padding:20,
  },
  trophy:{fontSize:100},
  winTitle:{fontSize:32,fontWeight:"bold"},
  winText:{fontSize:20,marginVertical:8},
});
