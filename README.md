# 🎮 AI Maze Escape Game

An interactive maze game that demonstrates the **Breadth First Search (BFS)** algorithm in Artificial Intelligence.

The player must reach the goal while an AI robot continuously searches for and follows the shortest path to catch the player.

## 🚀 Live Demo

🔗 

## 📌 Project Overview

**AI Maze Escape** is a browser-based game developed using HTML, CSS, and JavaScript.

The main purpose of this project is to demonstrate how the **Breadth First Search (BFS)** algorithm can be used in an AI game to find the shortest path through a maze.

### 🎯 Game Objective

- 🧑 Control the player using Arrow Keys or W/A/S/D.
- 🏁 Reach the goal before time runs out.
- 🤖 Avoid the AI robot.
- 🧠 The AI uses BFS to find the shortest path to the player.
- ⏱️ Complete the game within the given time.

## 🧠 AI Algorithm Used

### Breadth First Search (BFS)

BFS explores the maze **level by level**.

The algorithm:

1. Starts from the AI's current position.
2. Adds the starting cell to a queue.
3. Explores neighboring cells.
4. Marks visited cells to avoid repeated searches.
5. Stores parent cells to remember the path.
6. Continues until the player's position is found.
7. Reconstructs the shortest path.
8. The AI moves one step along that path.

### 🔄 BFS Flow

```text
AI Starting Position
        ↓
     BFS Search
        ↓
   Explore Neighbors
        ↓
   Find Player
        ↓
 Reconstruct Path
        ↓
   Shortest Path
        ↓
    AI Moves 🤖

## 👩‍💻 Author
**Puthi Amrutha Lahari**
