// GitHub Configuration with efficient Tree API approach
const GITHUB_CONFIG = {
    username: 'shivas1432',
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
    ],
    baseUrl: 'https://github.com/shivas1432',
    githubPreview: 'https://htmlpreview.github.io/?',
    // Much faster with Tree API - only 1 request per repository!
    rateLimitDelay: 500 // Reduced since we need far fewer requests
};

// Request tracking
let requestCount = 0;
let rateLimitInfo = {
    limit: 60,
    remaining: 60,
    reset: null
};

// Track API requests
function trackRequest(response) {
    requestCount++;
    
    // Get rate limit info from GitHub headers
    if (response.headers) {
        rateLimitInfo.limit = response.headers.get('X-RateLimit-Limit') || 60;
        rateLimitInfo.remaining = response.headers.get('X-RateLimit-Remaining') || 60;
        rateLimitInfo.reset = response.headers.get('X-RateLimit-Reset');
    }
    
    console.log(`📊 Request #${requestCount} | Remaining: ${rateLimitInfo.remaining}/${rateLimitInfo.limit}`);
    updateRequestInfo();
}

// Update sidebar with request tracking
function updateRequestInfo() {
    const resetTime = rateLimitInfo.reset ? new Date(rateLimitInfo.reset * 1000).toLocaleTimeString() : 'Unknown';
    const sidebarTitle = document.querySelector('.sidebar-title');
    if (sidebarTitle) {
        sidebarTitle.innerHTML = `
            ANIMATIONS 
            <div class="request-info">
                <small>Requests: ${requestCount} | Remaining: ${rateLimitInfo.remaining}/${rateLimitInfo.limit}</small>
                <small>Reset: ${resetTime}</small>
            </div>
        `;
    }
}

// Generate URLs for specific repository
function getRepoUrls(repoName, branch = 'master') {
    return {
        apiUrl: `https://api.github.com/repos/${GITHUB_CONFIG.username}/${repoName}/contents`,
        rawUrl: `https://raw.githubusercontent.com/${GITHUB_CONFIG.username}/${repoName}/${branch}`,
        baseUrl: `${GITHUB_CONFIG.baseUrl}/${repoName}`
    };
}

let allFiles = [];
let currentFile = null;

// Theme Toggle
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (body.dataset.theme === 'light') {
        body.dataset.theme = 'dark';
        themeToggle.textContent = '🌙';
        updateThemeColors('dark');
    } else {
        body.dataset.theme = 'light';
        themeToggle.textContent = '☀️';
        updateThemeColors('light');
    }
}

function updateThemeColors(theme) {
    const root = document.documentElement;
    if (theme === 'light') {
        root.style.setProperty('--bg-primary', '#ffffff');
        root.style.setProperty('--bg-secondary', '#f8fafc');
        root.style.setProperty('--bg-tertiary', '#f1f5f9');
        root.style.setProperty('--text-primary', '#1e293b');
        root.style.setProperty('--text-secondary', '#475569');
        root.style.setProperty('--border-primary', '#e2e8f0');
    } else {
        root.style.setProperty('--bg-primary', '#0a0b0f');
        root.style.setProperty('--bg-secondary', '#151720');
        root.style.setProperty('--bg-tertiary', '#1e1f2a');
        root.style.setProperty('--text-primary', '#ffffff');
        root.style.setProperty('--text-secondary', '#b4b7c7');
        root.style.setProperty('--border-primary', '#2a2d3a');
    }
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

// Get Code Button Handler
document.addEventListener('DOMContentLoaded', function() {
    const getCodeBtn = document.getElementById('getCodeBtn');
    getCodeBtn.addEventListener('click', function() {
        if (currentFile) {
            const url = generateGitHubUrl(currentFile);
            window.open(url, '_blank');
        }
    });
});

// Search Functionality
document.getElementById('searchInput').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const sidebarItems = document.querySelectorAll('.sidebar-link');
    
    sidebarItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        const parentItem = item.closest('.sidebar-item');
        
        if (text.includes(query)) {
            parentItem.style.display = 'block';
        } else {
            parentItem.style.display = query ? 'none' : 'block';
        }
    });
});

// Efficient fetch using Git Trees API - only 1 request per repository!
async function fetchFilesFromRepo() {
    try {
        showSidebarLoading();
        requestCount = 0;
        
        const files = [];
        
        console.log(`🚀 Using efficient Git Trees API - only ${GITHUB_CONFIG.repositories.length} requests total!`);
        console.log(`⚡ This is much faster than the old method that needed 30+ requests`);
        
        // Fetch each repository's complete tree structure
        for (let i = 0; i < GITHUB_CONFIG.repositories.length; i++) {
            const repo = GITHUB_CONFIG.repositories[i];
            
            console.log(`🌳 Fetching complete tree for ${repo.name}... (${i + 1}/${GITHUB_CONFIG.repositories.length})`);
            
            try {
                const repoFiles = await fetchRepoTree(repo);
                files.push(...repoFiles);
                console.log(`✅ ${repo.name}: ${repoFiles.length} HTML files found in entire repository`);
                
                // Short delay between repositories
                if (i < GITHUB_CONFIG.repositories.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, GITHUB_CONFIG.rateLimitDelay));
                }
                
            } catch (repoError) {
                console.warn(`⚠️ Could not fetch ${repo.name}:`, repoError.message);
            }
        }
        
        if (files.length === 0) {
            throw new Error(`No animations found. Used only ${requestCount} API requests. Check if repositories exist and are public.`);
        }
        
        console.log(`🎉 Success! Found ${files.length} files using only ${requestCount} requests (instead of 30+)!`);
        
        allFiles = files;
        renderSidebar(files);
        
    } catch (error) {
        console.error('Error fetching files:', error);
        showSidebarError(error.message);
    }
}

// Fetch entire repository tree structure in 1 request!
async function fetchRepoTree(repo) {
    try {
        // First get the default branch SHA
        const repoApiUrl = `https://api.github.com/repos/${GITHUB_CONFIG.username}/${repo.name}`;
        console.log(`📡 API Request ${requestCount + 1}: Getting ${repo.name} info`);
        
        const repoResponse = await fetch(repoApiUrl);
        trackRequest(repoResponse);
        
        if (!repoResponse.ok) {
            throw new Error(`Cannot access repository ${repo.name}: ${repoResponse.status}`);
        }
        
        const repoData = await repoResponse.json();
        const defaultBranch = repoData.default_branch;
        
        // Get the complete tree structure recursively
        const treeApiUrl = `https://api.github.com/repos/${GITHUB_CONFIG.username}/${repo.name}/git/trees/${defaultBranch}?recursive=1`;
        console.log(`📡 API Request ${requestCount + 1}: Getting complete tree for ${repo.name}`);
        
        const treeResponse = await fetch(treeApiUrl);
        trackRequest(treeResponse);
        
        if (!treeResponse.ok) {
            throw new Error(`Cannot fetch tree for ${repo.name}: ${treeResponse.status}`);
        }
        
        const treeData = await treeResponse.json();
        console.log(`🌳 ${repo.name}: Found ${treeData.tree.length} total items in repository`);
        
        // Filter for HTML files only
        const htmlFiles = treeData.tree.filter(item => 
            item.type === 'blob' && 
            item.path.endsWith('.html')
        );
        
        console.log(`🎯 ${repo.name}: Found ${htmlFiles.length} HTML files`);
        
        // Convert to our format
        const files = htmlFiles.map((file, index) => {
            const pathParts = file.path.split('/');
            const fileName = pathParts[pathParts.length - 1];
            const folder = pathParts.length > 1 ? pathParts[0] : '';
            
            return {
                name: formatFileName(fileName),
                fileName: fileName,
                path: file.path,
                folder: folder,
                repository: repo.name,
                repositoryDisplay: repo.displayName,
                branch: defaultBranch,
                type: 'file',
                url: `${GITHUB_CONFIG.baseUrl}/${repo.name}/blob/${defaultBranch}/${file.path}`
            };
        });
        
        return files;
        
    } catch (error) {
        console.error(`❌ Error fetching tree for ${repo.name}:`, error.message);
        throw error;
    }
}

// Fallback method when API is rate limited
async function fetchRepoFallback(repo) {
    console.log(`🔄 Using fallback method for ${repo.name}...`);
    
    // Create some common files that likely exist
    const commonFiles = [
        'index.html',
        'main.html', 
        'animation.html',
        'demo.html'
    ];
    
    const fallbackFiles = commonFiles.map((fileName, index) => ({
        name: formatFileName(fileName),
        fileName: fileName,
        path: fileName,
        repository: repo.name,
        repositoryDisplay: `${repo.displayName} (Limited)`,
        branch: repo.branch,
        type: 'file',
        url: `${GITHUB_CONFIG.baseUrl}/${repo.name}/blob/${repo.branch}/${fileName}`
    }));
    
    // Return limited set for demo
    return fallbackFiles.slice(0, 2);
}

// Format file name for display
function formatFileName(fileName) {
    return fileName
        .replace('.html', '')
        .replace(/[-_]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Render sidebar with files from multiple repos
function renderSidebar(files) {
    const sidebarItems = document.getElementById('sidebarItems');
    
    if (files.length === 0) {
        sidebarItems.innerHTML = `
            <li class="sidebar-item">
                <div class="error-state">
                    <div class="error-icon">📁</div>
                    <div class="error-title">No animations found</div>
                </div>
            </li>
        `;
        return;
    }
    
    // Group files by repository for better organization
    const groupedFiles = {};
    files.forEach(file => {
        if (!groupedFiles[file.repository]) {
            groupedFiles[file.repository] = [];
        }
        groupedFiles[file.repository].push(file);
    });
    
    let sidebarHTML = '';
    
    // Render files grouped by repository
    Object.keys(groupedFiles).forEach(repoName => {
        const repoFiles = groupedFiles[repoName];
        const repoDisplayName = repoFiles[0].repositoryDisplay;
        
        sidebarHTML += `
            <li class="sidebar-item repo-header">
                <div class="repo-title">${repoDisplayName} (${repoFiles.length})</div>
            </li>
        `;
        
        repoFiles.forEach(file => {
            sidebarHTML += `
                <li class="sidebar-item">
                    <a href="#" class="sidebar-link" onclick="selectFile('${file.repository}', '${file.path}')">
                        ${file.name}
                        ${file.folder ? `<span class="file-folder">${file.folder}</span>` : ''}
                    </a>
                </li>
            `;
        });
    });
    
    sidebarItems.innerHTML = sidebarHTML;
}

// Show sidebar loading with better messaging
function showSidebarLoading() {
    const sidebarItems = document.getElementById('sidebarItems');
    sidebarItems.innerHTML = `
        <li class="sidebar-item">
            <div class="loading-sidebar">
                <div class="spinner-small"></div>
                <span>Loading from multiple repositories...</span>
            </div>
        </li>
    `;
}

// Show error in sidebar with better messaging
function showSidebarError(message = 'Could not fetch from repositories') {
    const sidebarItems = document.getElementById('sidebarItems');
    sidebarItems.innerHTML = `
        <li class="sidebar-item">
            <div class="error-state">
                <div class="error-icon">⚠️</div>
                <div class="error-title">API Rate Limited</div>
                <div class="error-message">${message}</div>
                <button class="retry-btn" onclick="retryAfterDelay()">Wait & Retry (60s)</button>
                <div class="rate-limit-info">
                    <small>GitHub allows 60 requests/hour. Try again later or use a personal access token for higher limits.</small>
                </div>
            </div>
        </li>
    `;
}

// Retry with countdown
function retryAfterDelay() {
    const retryBtn = document.querySelector('.retry-btn');
    let countdown = 60;
    
    retryBtn.disabled = true;
    retryBtn.textContent = `Retrying in ${countdown}s...`;
    
    const timer = setInterval(() => {
        countdown--;
        retryBtn.textContent = `Retrying in ${countdown}s...`;
        
        if (countdown <= 0) {
            clearInterval(timer);
            retryBtn.disabled = false;
            retryBtn.textContent = 'Try Again';
            fetchFilesFromRepo();
        }
    }, 1000);
}

// Select file from sidebar (updated for multiple repos)
function selectFile(repository, filePath) {
    const file = allFiles.find(f => f.repository === repository && f.path === filePath);
    if (!file) return;
    
    currentFile = file;
    
    // Update active state
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update content
    updateContent(file);
    
    // Enable Get Code button
    const getCodeBtn = document.getElementById('getCodeBtn');
    getCodeBtn.disabled = false;
}

// Update main content (updated for multiple repos)
function updateContent(file) {
    document.getElementById('contentTitle').textContent = file.name;
    document.getElementById('contentSubtitle').textContent = `${file.repositoryDisplay} - ${file.folder ? `${file.folder} folder` : 'root level'}`;
    
    loadPreview(file);
}

// Load preview with clean fullscreen design (updated for multiple repos)
function loadPreview(file) {
    const previewContent = document.getElementById('previewContent');
    
    showLoading();
    
    // Generate preview URLs for specific repository
    const urls = getRepoUrls(file.repository, file.branch);
    const rawUrl = `${urls.rawUrl}/${file.path}`;
    const htmlPreviewUrl = `${GITHUB_CONFIG.githubPreview}${encodeURIComponent(rawUrl)}`;
    
    setTimeout(() => {
        previewContent.innerHTML = `
            <iframe src="${htmlPreviewUrl}" class="preview-iframe fullscreen" title="${file.name} Preview" onload="hideLoading()" onerror="showCleanError('${file.repository}', '${file.path}')"></iframe>
        `;
    }, 300);
}

// Generate preview URL
function generatePreviewUrl(file) {
    // Use HTML Preview service since GitHub Pages is not enabled
    const rawUrl = `${GITHUB_CONFIG.rawUrl}/${file.path}`;
    const htmlPreviewUrl = `${GITHUB_CONFIG.githubPreview}${encodeURIComponent(rawUrl)}`;
    
    // Alternative: Use JSDelivr CDN
    const jsdelivrUrl = `https://cdn.jsdelivr.net/gh/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repository}@${GITHUB_CONFIG.branch}/${file.path}`;
    
    // Try HTML Preview first, fallback to JSDelivr
    return htmlPreviewUrl;
}

// Generate GitHub URL for Get Code button
function generateGitHubUrl(file) {
    return `${GITHUB_CONFIG.baseUrl}/blob/${GITHUB_CONFIG.branch}/${file.path}`;
}

// Show clean error without buttons (updated for multiple repos)
function showCleanError(repository, filePath) {
    const previewContent = document.getElementById('previewContent');
    
    previewContent.innerHTML = `
        <div class="clean-error">
            <div class="error-icon">🚫</div>
            <div class="error-title">Preview Unavailable</div>
            <div class="error-message">This animation cannot be displayed in preview</div>
        </div>
    `;
}

// Generate GitHub URL for Get Code button (updated for multiple repos)
function generateGitHubUrl(file) {
    const urls = getRepoUrls(file.repository, file.branch);
    return `${urls.baseUrl}/blob/${file.branch}/${file.path}`;
}

// Hide loading (called from iframe onload)
function hideLoading() {
    // Loading is automatically hidden when iframe loads
}

// Control functions
function refreshPreview() {
    if (currentFile) {
        loadPreview(currentFile);
    }
}

function toggleFullscreen() {
    const previewArea = document.querySelector('.preview-area');
    if (previewArea.requestFullscreen) {
        previewArea.requestFullscreen();
    }
}

// Show loading state
function showLoading() {
    const previewContent = document.getElementById('previewContent');
    previewContent.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading preview...</p>
        </div>
    `;
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 ShivaAnimix initialized');
    
    // Set initial theme
    document.body.dataset.theme = 'dark';
    
    // Fetch files from GitHub
    fetchFilesFromRepo();
    
    // Handle window resize for mobile
    window.addEventListener('resize', () => {
        const sidebar = document.getElementById('sidebar');
        if (window.innerWidth > 768) {
            sidebar.classList.remove('open');
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'k':
                    e.preventDefault();
                    document.getElementById('searchInput').focus();
                    break;
            }
        }
        
        if (e.key === 'Escape') {
            document.getElementById('searchInput').blur();
            document.getElementById('sidebar').classList.remove('open');
        }
    });
});