# 🚀 Quick Setup Guide - SFU Video Calling

## ⚡ Quick Start (5 minutes)

### 1. Prerequisites
- Node.js 18+ installed
- MongoDB connection string
- Modern browser with WebRTC support

### 2. Environment Setup
```bash
# Clone and navigate
git clone https://github.com/farazmirzax/EduHaven.git
cd EduHaven

# Switch to SFU feature branch
git checkout feature/sfu-video-implementation
```

### 3. Server Setup
```bash
cd Server

# Install dependencies (includes mediasoup)
npm install

# Create .env file with:
echo "PORT=3000
MEDIASOUP_ANNOUNCED_IP=127.0.0.1
CORS_ORIGIN=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your-super-secret-jwt-key-for-eduhaven-2025-dev
Activation_Secret=eduhaven-activation-secret-key-2025-dev" > .env

# Start server
npm start
```

**✅ Expected output:**
```
Socket.IO initialized successfully
Server running at http://localhost:3000
Mediasoup worker and router created successfully
Mediasoup initialized successfully
Connected to Database
```

### 4. Client Setup
```bash
# New terminal window
cd Client

# Install dependencies (includes mediasoup-client)
npm install

# Start development server
npm run dev
```

**✅ Expected output:**
```
VITE v6.3.5  ready in 517 ms
➜  Local:   http://localhost:5173/
```

### 5. Test Multi-User Video Calling

1. **Open browser**: Navigate to `http://localhost:5173`
2. **Login**: Use OTP `123456` (temporary for testing)
3. **Join session**: Go to Sessions → Join/Create room
4. **Allow permissions**: Grant camera/microphone access
5. **Test multi-user**: Open 2-3 more browser tabs/windows and repeat

## 🎯 Key Features Implemented

- ✅ **SFU Architecture**: Scalable video calling (3+ participants)
- ✅ **Professional UI**: Modern design with gradients and animations
- ✅ **Real-time Communication**: Socket.IO + WebRTC
- ✅ **Media Controls**: Mute/unmute, camera toggle, screen share
- ✅ **Responsive Design**: Works on desktop and mobile
- ✅ **Error Handling**: Graceful fallbacks for permissions

## 🔧 Troubleshooting

### Server won't start?
```bash
# Check if port 3000 is free
netstat -an | findstr :3000

# Kill any existing Node processes
taskkill /f /im node.exe

# Restart server
npm start
```

### Camera not working?
1. **Allow browser permissions** when prompted
2. **Refresh page** and try again
3. **Try different browser** (Chrome, Firefox, Edge)
4. **App creates dummy video** if permissions denied

### Socket connection issues?
1. **Check server is running** (see server logs)
2. **Verify CORS_ORIGIN** matches client URL
3. **Try hard refresh** (Ctrl+F5)

## 📖 Full Documentation

For detailed documentation, see: [`docs/SFU_IMPLEMENTATION.md`](./SFU_IMPLEMENTATION.md)

## 🎉 Success Indicators

When everything is working correctly:

**Server Logs:**
```
✅ Mediasoup worker and router created successfully
✅ User connected: [username]
✅ User [user-id] joined SFU room [room-id]
✅ Mediasoup producer created for peer [peer-id]
```

**Client UI:**
```
✅ Video feeds visible for all participants
✅ Connection status indicators show green
✅ Media controls respond correctly
✅ Participant count updates dynamically
```

**Performance:**
```
✅ No lag or freezing with multiple participants
✅ Smooth video/audio quality
✅ Quick connection establishment
✅ Stable during participant join/leave
```

---

**🎯 Ready for production!** The SFU implementation provides scalable video calling that replaces the P2P mesh topology and supports multiple participants efficiently.
