# ShivaAnimix - Animation Component Library

A modern, dynamic animation showcase that automatically fetches and displays HTML animations from multiple GitHub repositories. Built with vanilla HTML, CSS, and JavaScript for maximum compatibility and performance.

![ShivaAnimix Demo](https://img.shields.io/badge/Demo-Live-brightgreen)
![GitHub API](https://img.shields.io/badge/GitHub%20API-Integrated-blue)
![No Dependencies](https://img.shields.io/badge/Dependencies-Zero-orange)

## ✨ Features

### 🎯 **Core Functionality**
- **Multi-Repository Support** - Automatically fetches from 3+ GitHub repositories
- **Real-time Preview** - Live HTML preview using multiple preview services
- **Smart Categorization** - Automatically organizes animations by type and source
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Dark/Light Theme** - Toggle between themes with smooth transitions

### 🔍 **Smart Discovery**
- **Git Trees API** - Efficiently fetches entire repository structure in 2 requests per repo
- **Recursive Scanning** - Finds HTML files in all folders and subfolders
- **Auto-Categorization** - Groups animations by repository and folder structure
- **Real-time Search** - Filter animations instantly as you type

### 🌐 **Preview System**
- **HTML Preview Service** - Primary preview method using htmlpreview.github.io
- **JSDelivr CDN** - Fast alternative preview option
- **Fallback System** - Multiple preview methods ensure reliability
- **Direct GitHub Links** - Easy access to source code

## 🏗️ **Architecture**

### **File Structure**
```
ShivaAnimix/
├── index.html          # Main application
├── styles.css          # All styling and themes
├── script.js           # Core JavaScript functionality
└── README.md           # This file
```

### **Tech Stack**
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **APIs**: GitHub REST API, Git Trees API
- **Preview**: HTML Preview Service, JSDelivr CDN
- **Styling**: CSS Grid, Flexbox, CSS Variables
- **No Framework Dependencies** - Pure web technologies

## 🔧 **Configuration**

### **Repository Setup**
The app fetches animations from these repositories by default:
```javascript
repositories: [
    {
        name: 'Animated-DesignsP1',
        displayName: 'Animated Designs P1',
        branch: 'master'
    },
    {
        name: 'Animated-DesignsP2', 
        displayName: 'Animated Designs P2',
        branch: 'master'
    },
    {
        name: 'Animated-DesignsP3',
        displayName: 'Animated Designs P3', 
        branch: 'master'
    }
]
```

### **GitHub API Limits**
- **Unauthenticated**: 60 requests/hour (current setup)
- **With Token**: 5,000 requests/hour (recommended for production)

## 🚀 **Quick Start**

### **1. Clone the Repository**
```bash
git clone https://github.com/yourusername/ShivaAnimix.git
cd ShivaAnimix
```

### **2. Open in Browser**
```bash
# Simple local server
python -m http.server 8000
# or
npx serve .
# or just open index.html in browser
```

### **3. View Animations**
- Open `http://localhost:8000` in your browser
- Wait for animations to load from GitHub
- Click any animation to see live preview
- Use "Get Code" to view source on GitHub

## ⚙️ **Advanced Setup**

### **Adding GitHub Token (Recommended)**
For better performance and higher rate limits:

1. **Create Personal Access Token**:
   - Go to GitHub → Settings → Developer settings → Personal access tokens
   - Generate new token with `public_repo` scope
   - Copy the token

2. **Add to Configuration**:
   ```javascript
   // In script.js, line ~20
   token: 'ghp_your_token_here', // Replace with your token
   ```

3. **Benefits**:
   - 5,000 requests/hour (vs 60 without token)
   - More reliable loading
   - Faster refresh rates

### **Customizing Repositories**
To fetch from your own repositories:

```javascript
// Edit GITHUB_CONFIG in script.js
const GITHUB_CONFIG = {
    username: 'your-username',
    repositories: [
        {
            name: 'your-animations-repo',
            displayName: 'My Animations',
            branch: 'main'
        }
    ]
    // ... rest of config
};
```

## 🤝 **Contributing & Collaboration**

### **How to Add Your Animations**

#### **Option 1: Fork & Customize**
1. **Fork this repository**
2. **Update configuration** with your GitHub details:
   ```javascript
   username: 'your-username',
   repositories: [
       { name: 'your-animation-repo', displayName: 'Your Animations', branch: 'main' }
   ]
   ```
3. **Deploy** to GitHub Pages or any hosting service

#### **Option 2: Contribute to Source Repositories**
1. **Fork** one of the animation repositories:
   - [Animated-DesignsP1](https://github.com/shivas1432/Animated-DesignsP1)
   - [Animated-DesignsP2](https://github.com/shivas1432/Animated-DesignsP2)
   - [Animated-DesignsP3](https://github.com/shivas1432/Animated-DesignsP3)

2. **Add your animations**:
   ```
   your-animation/
   ├── animation.html      # Main animation file
   ├── styles.css         # Optional: separate styles
   └── script.js          # Optional: separate JavaScript
   ```

3. **Create Pull Request** with your animations
4. **Automatic Discovery** - Your animations will appear in ShivaAnimix automatically

### **Animation Guidelines**
- **Self-contained HTML files** work best
- **Responsive design** recommended
- **No external dependencies** preferred
- **Creative and original** animations welcomed
- **Clean, commented code** appreciated

## 🐛 **Known Issues & Troubleshooting**

### **Rate Limiting (Most Common)**
**Problem**: "403 Forbidden" errors, "Remaining: 0/60"
**Solution**: 
- Wait 1 hour for rate limit reset, or
- Add GitHub Personal Access Token (see Advanced Setup)

### **Preview Not Loading**
**Problem**: Animation shows but preview is blank
**Causes**:
- HTML file has external dependencies
- CORS restrictions
- Large file size

**Solutions**:
- Use "Get Code" button to view source
- Try different preview methods
- Ensure animations are self-contained

### **Repository Not Found**
**Problem**: "Repository not found (404)"
**Solution**:
- Check repository name spelling
- Ensure repository is public
- Verify GitHub username in configuration

### **Slow Loading**
**Problem**: Takes long time to load animations
**Causes**:
- Many repositories/folders
- Rate limiting approaching
- Network connectivity

**Solutions**:
- Add GitHub token for higher limits
- Reduce number of repositories
- Check internet connection

## 📈 **Performance**

### **Optimization Features**
- **Efficient API Usage**: Only 2 requests per repository (vs 30+ with naive approach)
- **Smart Caching**: Reuses fetched data when possible
- **Progressive Loading**: Shows results as they arrive
- **Request Tracking**: Monitors API usage in real-time
- **Fallback Strategies**: Multiple preview methods for reliability

### **Metrics**
- **Load Time**: ~3-5 seconds for 50+ animations
- **API Requests**: 6 total (3 repositories × 2 requests each)
- **Memory Usage**: Minimal (no external libraries)
- **Bundle Size**: ~15KB total (HTML + CSS + JS)

## 🎨 **Customization**

### **Themes**
- Built-in dark/light theme toggle
- CSS variables for easy customization
- Responsive design patterns

### **Layout**
- Sidebar navigation (React Bits inspired)
- Clean preview area
- Mobile-friendly responsive design

### **Styling**
```css
/* Easy theme customization */
:root {
    --accent-primary: #4f46e5;    /* Change primary color */
    --bg-primary: #0a0b0f;       /* Change background */
    --text-primary: #ffffff;     /* Change text color */
}
```

## 🔗 **Related Projects**

- **[Animated-DesignsP1](https://github.com/shivas1432/Animated-DesignsP1)** - Core animation collection
- **[Animated-DesignsP2](https://github.com/shivas1432/Animated-DesignsP2)** - Extended animations
- **[Animated-DesignsP3](https://github.com/shivas1432/Animated-DesignsP3)** - Latest animations

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 **Author**

**Shiva** - [@shivas1432](https://github.com/shivas1432)

## 🙏 **Acknowledgments**

- **GitHub API** for powerful repository access
- **HTML Preview Service** for iframe previews
- **JSDelivr** for fast CDN delivery
- **React Bits** for design inspiration
- **All contributors** who add animations to the collection

## 📞 **Support**

### **Getting Help**
- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/ShivaAnimix/issues)
- **Discussions**: [Ask questions or share ideas](https://github.com/yourusername/ShivaAnimix/discussions)
- **Email**: Contact through GitHub profile

### **Contributing**
We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### **Code of Conduct**
Please read our [Code of Conduct](CODE_OF_CONDUCT.md) to keep our community approachable and respectable.

---

**Made with ❤️ by the animation community**

*ShivaAnimix - Showcasing creativity, one animation at a time* ✨
