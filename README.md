[![join our group on discord](./Client/public/joinDiscordIcon.png)
](https://discord.gg/yMBMNdmC)

# EduHaven

![image](https://github.com/user-attachments/assets/970c84bf-ac78-4583-af73-d2b8b4b393b0)

## Overview

**EduHaven** is a platform designed to assist students in their academic journey by providing a productivity-focused environment. With features like task management, note-making, real-time study rooms, and a social touch, it aims to simplify and enhance the learning process. The project is built with the **MERN stack** and incorporates real-time collaboration, analytics, and optional AI-powered tools.

## Features

- ### User Dashboard
 <img width="1919" height="882" alt="image" src="https://github.com/user-attachments/assets/f9b8d325-8dbd-4d31-a07f-08f1cd2d9452" />

  - Track tasks completed, study time, and productivity stats  
  - Add and manage notes directly from dashboard  
  - Integrated calendars for event planning  
  - Quick access to stats and insights  

- ### Calendar & Events
  <img width="485" height="798" alt="image" src="https://github.com/user-attachments/assets/0f932aee-b3b3-4a29-a3e6-19a1c5804a52" />

  - **User-Specific Events**: Each user can only view and manage their own calendar events  
  - **Event Management**: Create, edit, and delete personal events with date/time  
  - **Privacy & Security**: Secure authentication ensures event privacy across users  

- ### Enhanced Goals System
   <img width="669" height="480" alt="image" src="https://github.com/user-attachments/assets/71a57f9e-b8e6-41a5-8f7c-bbcad530ff25" />

  - **Data Persistence**: All goals persist in database across sessions  
  - **Smart Organization**: Three collapsible sections (Daily Habits, Other Goals, Closed Goals)  
  - **Repeat Functionality**: Daily habits automatically recreate when completed  
  - **Deadline Tracking**: Visual indicators for time left, due today, or overdue  

- ### To-Do List : Helps users organize and manage their tasks efficiently.
  

-  ### Note-Making: Rich-text editor to create, edit, and organize notes.
  <img width="1895" height="869" alt="image" src="https://github.com/user-attachments/assets/20a05018-4054-4784-a007-ee4ce4af69eb" />


- ### Real-Time Study Rooms
   <img width="1919" height="879" alt="image" src="https://github.com/user-attachments/assets/5eec7b1b-189a-48f3-abc1-6db75df01deb" />

  - Join or create study rooms for collaboration  
  - Video/audio controls using WebRTC  
  - Session tracking and collaboration tools  

- ### Realtime Chat 
<img width="1919" height="870" alt="image" src="https://github.com/user-attachments/assets/357b6eac-beb5-4369-98a0-2665c967c6e1" />

  - Chat with peers inside study rooms  
  - Private messaging and group chat support  
  - Online/offline presence indicators  

- ### Chatbot : Provides productivity tips and answers academic questions.  
<img width="391" height="860" alt="image" src="https://github.com/user-attachments/assets/0c25c3cb-3146-40f8-a527-ae0253ae7875" />


- ### Friends and Social Features
   <img width="1919" height="865" alt="image" src="https://github.com/user-attachments/assets/5f780027-3b2a-40b3-8d68-89abed4a6128" />

  - Add friends, invite them to study rooms  
  - Track their online/offline status  
  - Share study goals and progress  

- ### Analytics: Visualize progress with charts and insights.
    <img width="1919" height="859" alt="image" src="https://github.com/user-attachments/assets/eef0a2c7-a4ac-4657-a7a9-c17f9cbbb11f" />


- ### Gamification
   <img width="1919" height="863" alt="image" src="https://github.com/user-attachments/assets/a0dc5908-5751-47c5-bc24-e45013a7e9f3" />

  - Earn badges and rewards for task completion  
  - Track streaks to stay motivated  
  - Leaderboards for friendly competition  

## Tech Stack

- **Frontend**: React.js with CSS (or Tailwind CSS)  
- **Backend**: Node.js with Express  
- **Database**: MongoDB  
- **Real-Time Communication**: Socket.IO, WebRTC  

## Installation and Setup

### Prerequisites

- Node.js  
- MongoDB  
- Git  

### Steps to Run Locally

1. After forking the repository, Clone the forked repository:

   ```bash
   git clone https://github.com/<your-username>/EduHaven.git
   cd EduHaven

2. Install dependencies:

   ```bash
   # Install backend dependencies
   cd Server
   npm install

   # Install frontend dependencies
   cd ../Client
   npm install
   ```

3. Set up environment variables:

   - **for frontend:**

     - create a `.env` file in the `/Client` directory, and copy all the contents from `.env.example`.

   - **for backend:**

     - Create a `.env` file in the `/Server` directory.
     - Follow the instructions provided in `.env.example` file to create a new `.env` file for backend.

4. Start the development servers:

   ```bash
   # Start backend server
   cd Server
   npm run dev

   # Start frontend server
   cd ../Client
   npm run dev
   ```

## Contribution Guidelines

1. You must get assigned to the issue so others know you're working on it. leave comment to get issue assigned.
2. Code must be properly formatted. (use preetier)
3. Commits should generally be minimal
4. The body of the commit message should explain why and how the change was made.It should provide clear context for all changes mage that will help both a reviewer now, and a developer looking at your changes a year later, understand the motivation behind your decisions.

We welcome contributions to make **EduHaven** better for students everywhere! Here’s how you can contribute:

1. Fork the repository.
2. Create a new branch for your feature/bugfix:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and test them thoroughly.
- For frontend changes, also run:
  ```bash
  npm run build
  ```
  and verify there are no build errors. 

4. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Add a brief description of your changes"
   git push origin feature-name
   ```
5. Before pushing frontend changes, **run** `npm run build` locally to ensure the project builds successfully. Catch & solve any potential deployment issues early, if any.
6. Create a Pull Request (PR) with a detailed explanation of your changes.

## Roadmap

1. **Phase 1**: Core features - User authentication, to-do list, note-making.
2. **Phase 2**: Real-time study rooms, chatbot integration, and social features.
3. **Phase 3**: Analytics, gamification, and AI-powered enhancements.
4. **Phase 4**: Mobile app development and premium features.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Special thanks to contributors for their efforts in building **EduHaven**.
- Inspired by productivity tools and online collaborative platforms.

---


## Preventing Backend Cold Starts
The backend is hosted on Render Free Tier and may go to sleep after short inactivity.  
We have implemented a keep-alive solution using [cron-job.org](https://cron-job.org/) to ping the backend every 1 minute:

- URL: https://eduhaven-backend.onrender.com/
- Interval: Every 1 minute
- Purpose: Prevents backend cold starts for faster response times.

For full details, see [`KEEP_ALIVE.md`](KEEP_ALIVE.md).


For any further queries, feel free to reach out on our [Discord](https://discord.gg/yMBMNdmC) group. Let’s make learning fun and productive!
