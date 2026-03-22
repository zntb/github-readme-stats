// @ts-check

// @ts-ignore
export default async (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GitHub Readme Stats - URL Builder</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :root {
      --primary: #2f80ed;
      --bg: #f5f6f8;
      --card-bg: #ffffff;
      --text: #24292e;
      --text-muted: #586069;
      --border: #e1e4e8;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
      min-height: 100vh;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    header {
      text-align: center;
      margin-bottom: 2rem;
    }

    header h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    header p {
      color: var(--text-muted);
    }

    .builder-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    @media (max-width: 1024px) {
      .builder-layout {
        grid-template-columns: 1fr;
      }
    }

    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 1.5rem;
    }

    .card h2 {
      font-size: 1.25rem;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--border);
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      font-weight: 600;
      margin-bottom: 0.375rem;
      font-size: 0.875rem;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 0.5rem 0.75rem;
      font-size: 0.875rem;
      border: 1px solid var(--border);
      border-radius: 6px;
      background: var(--card-bg);
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(47, 128, 237, 0.1);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .color-inputs {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
    }

    .color-input {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .color-input input[type="color"] {
      width: 40px;
      height: 32px;
      padding: 2px;
      cursor: pointer;
    }

    .color-input input[type="text"] {
      flex: 1;
      font-family: monospace;
    }

    .checkbox-group {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-weight: normal;
      cursor: pointer;
    }

    .checkbox-label input {
      width: auto;
    }

    .preview-container {
      position: sticky;
      top: 2rem;
    }

    .preview-frame {
      background: #fafbfc;
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 1rem;
      min-height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
      overflow: hidden;
    }

    .preview-frame img {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
    }

    .preview-frame .placeholder {
      color: var(--text-muted);
      font-style: italic;
    }

    .generated-url {
      background: #f6f8fa;
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 0.75rem;
      margin-bottom: 0.75rem;
      word-break: break-all;
      font-family: monospace;
      font-size: 0.8125rem;
      max-height: 100px;
      overflow-y: auto;
    }

    .btn-group {
      display: flex;
      gap: 0.5rem;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      font-weight: 600;
      border-radius: 6px;
      border: 1px solid var(--border);
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
    }

    .btn-primary {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
    }

    .btn-primary:hover {
      background: #1a6fd4;
    }

    .btn-secondary {
      background: var(--card-bg);
      color: var(--text);
    }

    .btn-secondary:hover {
      background: #f3f4f6;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .card-type-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .tab-btn {
      padding: 0.5rem 1rem;
      border: 1px solid var(--border);
      border-radius: 6px;
      background: var(--card-bg);
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .tab-btn:hover {
      background: #f3f4f6;
    }

    .tab-btn.active {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
    }

    .options-section {
      display: none;
    }

    .options-section.active {
      display: block;
    }

    .toast {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: #24292e;
      color: white;
      padding: 0.75rem 1rem;
      border-radius: 6px;
      font-size: 0.875rem;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.3s;
      pointer-events: none;
    }

    .toast.show {
      opacity: 1;
      transform: translateY(0);
    }

    .advanced-toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 1rem 0;
      cursor: pointer;
      color: var(--primary);
      font-size: 0.875rem;
    }

    .advanced-options {
      display: none;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border);
    }

    .advanced-options.show {
      display: block;
    }

    .help-text {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>GitHub Readme Stats - URL Builder</h1>
      <p>Build your custom card URL with live preview</p>
    </header>

    <div class="builder-layout">
      <div class="card">
        <h2>Card Configuration</h2>
        
        <div class="card-type-tabs" id="cardTypeTabs">
          <button type="button" class="tab-btn active" data-type="stats">Stats</button>
          <button type="button" class="tab-btn" data-type="pin">Pin</button>
          <button type="button" class="tab-btn" data-type="top-langs">Top Languages</button>
          <button type="button" class="tab-btn" data-type="streak">Streak</button>
          <button type="button" class="tab-btn" data-type="gist">Gist</button>
          <button type="button" class="tab-btn" data-type="wakatime">Wakatime</button>
        </div>

        <!-- Stats Card Options -->
        <div class="options-section active" id="stats-options">
          <div class="form-group">
            <label for="stats-username">Username *</label>
            <input type="text" id="stats-username" placeholder="Your GitHub username">
          </div>
          <div class="form-group">
            <label for="stats-title">Custom Title</label>
            <input type="text" id="stats-title" placeholder="e.g., My GitHub Stats">
          </div>
          <div class="form-group">
            <label>Show Stats</label>
            <div class="checkbox-group">
              <label class="checkbox-label"><input type="checkbox" value="prs_merged" checked> PRs Merged</label>
              <label class="checkbox-label"><input type="checkbox" value="prs_merged_percentage" checked> Merged %</label>
              <label class="checkbox-label"><input type="checkbox" value="discussions_started"> Discussions</label>
              <label class="checkbox-label"><input type="checkbox" value="discussions_answered"> Answers</label>
              <label class="checkbox-label"><input type="checkbox" value="stars" checked> Stars</label>
              <label class="checkbox-label"><input type="checkbox" value="commits" checked> Commits</label>
              <label class="checkbox-label"><input type="checkbox" value="prs" checked> PRs</label>
              <label class="checkbox-label"><input type="checkbox" value="issues" checked> Issues</label>
              <label class="checkbox-label"><input type="checkbox" value="contribs" checked> Contributions</label>
            </div>
          </div>
          <div class="form-group">
            <label for="stats-hide">Hide Stats (comma separated)</label>
            <input type="text" id="stats-hide" placeholder="e.g., prs_merged,stars">
          </div>
        </div>

        <!-- Pin Card Options -->
        <div class="options-section" id="pin-options">
          <div class="form-group">
            <label for="pin-username">Username *</label>
            <input type="text" id="pin-username" placeholder="Your GitHub username">
          </div>
          <div class="form-group">
            <label for="pin-repo">Repository *</label>
            <input type="text" id="pin-repo" placeholder="e.g., your-repo-name">
          </div>
          <div class="form-group">
            <label for="pin-title">Custom Title</label>
            <input type="text" id="pin-title" placeholder="e.g., My Awesome Repo">
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" id="pin-show-owner"> Show Owner
            </label>
          </div>
        </div>

        <!-- Top Languages Card Options -->
        <div class="options-section" id="top-langs-options">
          <div class="form-group">
            <label for="langs-username">Username *</label>
            <input type="text" id="langs-username" placeholder="Your GitHub username">
          </div>
          <div class="form-group">
            <label for="langs-title">Custom Title</label>
            <input type="text" id="langs-title" placeholder="e.g., Most Used Languages">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="langs-layout">Layout</label>
              <select id="langs-layout">
                <option value="normal">Normal</option>
                <option value="compact">Compact</option>
                <option value="donut">Donut</option>
                <option value="donut-vertical">Donut Vertical</option>
                <option value="pie">Pie</option>
              </select>
            </div>
            <div class="form-group">
              <label for="langs-count">Languages Count</label>
              <input type="number" id="langs-count" value="5" min="1" max="20">
            </div>
          </div>
        </div>

        <!-- Streak Card Options -->
        <div class="options-section" id="streak-options">
          <div class="form-group">
            <label for="streak-username">Username *</label>
            <input type="text" id="streak-username" placeholder="Your GitHub username">
          </div>
          <div class="form-group">
            <label for="streak-title">Custom Title</label>
            <input type="text" id="streak-title" placeholder="e.g., GitHub Streak">
          </div>
        </div>

        <!-- Gist Card Options -->
        <div class="options-section" id="gist-options">
          <div class="form-group">
            <label for="gist-id">Gist ID *</label>
            <input type="text" id="gist-id" placeholder="e.g., your-gist-id">
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" id="gist-show-owner"> Show Owner
            </label>
          </div>
        </div>

        <!-- Wakatime Card Options -->
        <div class="options-section" id="wakatime-options">
          <div class="form-group">
            <label for="wakatime-username">Wakatime Username *</label>
            <input type="text" id="wakatime-username" placeholder="Your Wakatime username">
          </div>
          <div class="form-group">
            <label for="wakatime-title">Custom Title</label>
            <input type="text" id="wakatime-title" placeholder="e.g., My Wakatime Stats">
          </div>
          <div class="form-group">
            <label for="wakatime-layout">Layout</label>
            <select id="wakatime-layout">
              <option value="normal">Normal</option>
              <option value="compact">Compact</option>
            </select>
          </div>
        </div>

        <!-- Theme Options -->
        <h2 style="margin-top: 1.5rem;">Appearance</h2>
        
        <div class="form-group">
          <label for="theme-select">Theme</label>
          <select id="theme-select">
            <option value="">Custom (No Theme)</option>
            <option value="default">Default</option>
            <option value="dark">Dark</option>
            <option value="radical">Radical</option>
            <option value="merko">Merko</option>
            <option value="gruvbox">Gruvbox</option>
            <option value="gruvbox_light">Gruvbox Light</option>
            <option value="tokyonight">Tokyonight</option>
            <option value="onedark">One Dark</option>
            <option value="dracula">Dracula</option>
            <option value="monokai">Monokai</option>
            <option value="nightowl">Night Owl</item>
            <option value="buefy">Buefy</option>
            <option value="blue-green">Blue Green</option>
            <option value="algolia">Algolia</option>
            <option value="great-gatsby">Great Gatsby</option>
            <option value="ayu-mirage">Ayu Mirage</option>
            <option value="midnight-purple">Midnight Purple</option>
            <option value="calm">Calm</option>
            <option value="flag-india">Flag India</option>
            <option value="omni">Omni</option>
            <option value="comfos">Comfos</option>
            <option value="maroongold">Maroongold</option>
            <option value="yeblu">Yeblu</option>
            <option value="blueberry">Blueberry</option>
            <option value="slateorange">Slate Orange</option>
            <option value="kacho_ga">Kacho Ga</option>
            <option value="outrun">Outrun</option>
            <option value="ocean_dark">Ocean Dark</option>
            <option value="city_lights">City Lights</option>
            <option value="github_dark">GitHub Dark</option>
            <option value="github_dimmed">GitHub Dimmed</option>
            <option value="synthwave">Synthwave</option>
            <option value="highcontrast">High Contrast</option>
            <option value="colorful">Colorful</option>
            <option value="transparent">Transparent</option>
            <option value="shadow_red">Shadow Red</option>
            <option value="shadow_green">Shadow Green</option>
            <option value="shadow_blue">Shadow Blue</option>
          </select>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="title-color">Title Color</label>
            <div class="color-input">
              <input type="color" id="title-color-picker" value="#2f80ed">
              <input type="text" id="title-color" value="#2f80ed" pattern="[0-9a-fA-F]{6}">
            </div>
          </div>
          <div class="form-group">
            <label for="icon-color">Icon Color</label>
            <div class="color-input">
              <input type="color" id="icon-color-picker" value="#4c71f2">
              <input type="text" id="icon-color" value="#4c71f2" pattern="[0-9a-fA-F]{6}">
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="text-color">Text Color</label>
            <div class="color-input">
              <input type="color" id="text-color-picker" value="#434d58">
              <input type="text" id="text-color" value="#434d58" pattern="[0-9a-fA-F]{6}">
            </div>
          </div>
          <div class="form-group">
            <label for="bg-color">Background Color</label>
            <div class="color-input">
              <input type="color" id="bg-color-picker" value="#fffefe">
              <input type="text" id="bg-color" value="#fffefe" pattern="[0-9a-fA-F]{6}">
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="border-color">Border Color</label>
          <div class="color-input">
            <input type="color" id="border-color-picker" value="#e4e2e2">
            <input type="text" id="border-color" value="#e4e2e2" pattern="[0-9a-fA-F]{6}">
          </div>
        </div>

        <div class="advanced-toggle" id="advancedToggle">
          <span>▼</span> Advanced Options
        </div>

        <div class="advanced-options" id="advancedOptions">
          <div class="form-row">
            <div class="form-group">
              <label for="border-radius">Border Radius</label>
              <input type="number" id="border-radius" value="4.5" min="0" max="30" step="0.5">
            </div>
            <div class="form-group">
              <label for="card-width">Card Width</label>
              <input type="number" id="card-width" placeholder="e.g., 300">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="cache-seconds">Cache (seconds)</label>
              <input type="number" id="cache-seconds" placeholder="e.g., 86400">
              <div class="help-text">Min: ${Math.floor(1440 / 2)}, Max: 86400</div>
            </div>
            <div class="form-group">
              <label for="locale">Locale</label>
              <input type="text" id="locale" placeholder="e.g., en, cn, de">
            </div>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" id="hide-border"> Hide Border
            </label>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" id="hide-title"> Hide Title
            </label>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" id="disable-animations"> Disable Animations
            </label>
          </div>
        </div>
      </div>

      <div class="preview-container">
        <div class="card">
          <h2>Live Preview</h2>
          <div class="preview-frame" id="previewFrame">
            <span class="placeholder">Configure your card to see the preview</span>
          </div>
          
          <label style="font-weight: 600; font-size: 0.875rem; display: block; margin-bottom: 0.375rem;">Generated URL</label>
          <div class="generated-url" id="generatedUrl">Enter a username to generate URL</div>
          
          <div class="btn-group">
            <button type="button" class="btn btn-primary" id="copyBtn" disabled>Copy URL</button>
            <a href="#" class="btn btn-secondary" id="openBtn" target="_blank" rel="noopener noreferrer">Open in New Tab</a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="toast" id="toast">Copied to clipboard!</div>

  <script>
    // Card type tabs
    const tabs = document.querySelectorAll('.tab-btn');
    const optionsSections = document.querySelectorAll('.options-section');
    let currentCardType = 'stats';

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const type = tab.dataset.type;
        currentCardType = type;
        
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        optionsSections.forEach(section => {
          section.classList.remove('active');
        });
        
        document.getElementById(type + '-options').classList.add('active');
        
        updatePreview();
      });
    });

    // Color pickers sync with text inputs
    const colorMappings = [
      { picker: 'title-color-picker', text: 'title-color' },
      { picker: 'icon-color-picker', text: 'icon-color' },
      { picker: 'text-color-picker', text: 'text-color' },
      { picker: 'bg-color-picker', text: 'bg-color' },
      { picker: 'border-color-picker', text: 'border-color' }
    ];

    colorMappings.forEach(({ picker, text }) => {
      const pickerEl = document.getElementById(picker);
      const textEl = document.getElementById(text);
      
      pickerEl.addEventListener('input', () => {
        textEl.value = pickerEl.value;
        updatePreview();
      });
      
      textEl.addEventListener('input', () => {
        if (/^[0-9a-fA-F]{6}$/.test(textEl.value)) {
          pickerEl.value = '#' + textEl.value;
          updatePreview();
        }
      });
    });

    // Theme selector
    const themeSelect = document.getElementById('theme-select');
    themeSelect.addEventListener('change', () => {
      const theme = themeSelect.value;
      if (theme) {
        // Reset to custom colors when no theme
        document.getElementById('theme-select').value = theme;
      }
      updatePreview();
    });

    // Advanced options toggle
    const advancedToggle = document.getElementById('advancedToggle');
    const advancedOptions = document.getElementById('advancedOptions');
    advancedToggle.addEventListener('click', () => {
      advancedOptions.classList.toggle('show');
      advancedToggle.querySelector('span').textContent = advancedOptions.classList.contains('show') ? '▲' : '▼';
    });

    // Build the URL
    function buildUrl() {
      const params = new URLSearchParams();
      
      // Add theme if selected
      const theme = document.getElementById('theme-select').value;
      if (theme) {
        params.set('theme', theme);
      } else {
        // Add custom colors
        const titleColor = document.getElementById('title-color').value;
        const iconColor = document.getElementById('icon-color').value;
        const textColor = document.getElementById('text-color').value;
        const bgColor = document.getElementById('bg-color').value;
        const borderColor = document.getElementById('border-color').value;
        
        if (titleColor && titleColor !== '2f80ed') params.set('title_color', titleColor);
        if (iconColor && iconColor !== '4c71f2') params.set('icon_color', iconColor);
        if (textColor && textColor !== '434d58') params.set('text_color', textColor);
        if (bgColor && bgColor !== 'fffefe') params.set('bg_color', bgColor);
        if (borderColor && borderColor !== 'e4e2e2') params.set('border_color', borderColor);
      }
      
      // Advanced options
      const borderRadius = document.getElementById('border-radius').value;
      if (borderRadius && borderRadius !== '4.5') params.set('border_radius', borderRadius);
      
      const cardWidth = document.getElementById('card-width').value;
      if (cardWidth) params.set('card_width', cardWidth);
      
      const cacheSeconds = document.getElementById('cache-seconds').value;
      if (cacheSeconds) params.set('cache_seconds', cacheSeconds);
      
      const locale = document.getElementById('locale').value;
      if (locale) params.set('locale', locale);
      
      if (document.getElementById('hide-border').checked) params.set('hide_border', 'true');
      if (document.getElementById('hide-title').checked) params.set('hide_title', 'true');
      if (document.getElementById('disable-animations').checked) params.set('disable_animations', 'true');
      
      // Card-specific options
      let endpoint = '/api';
      let username = '';
      let valid = false;
      
      switch (currentCardType) {
        case 'stats':
          username = document.getElementById('stats-username').value.trim();
          if (username) {
            params.set('username', username);
            valid = true;
            
            const customTitle = document.getElementById('stats-title').value;
            if (customTitle) params.set('custom_title', customTitle);
            
            const hideStats = document.getElementById('stats-hide').value;
            if (hideStats) params.set('hide', hideStats);
            
            // Get selected show options
            const showCheckboxes = document.querySelectorAll('#stats-options input[type="checkbox"][value]');
            const showValues = Array.from(showCheckboxes)
              .filter(cb => cb.checked)
              .map(cb => cb.value);
            if (showValues.length > 0) {
              params.set('show', showValues.join(','));
            }
          }
          break;
          
        case 'pin':
          username = document.getElementById('pin-username').value.trim();
          const repo = document.getElementById('pin-repo').value.trim();
          if (username && repo) {
            endpoint = '/api/pin';
            params.set('username', username);
            params.set('repo', repo);
            valid = true;
            
            const pinTitle = document.getElementById('pin-title').value;
            if (pinTitle) params.set('custom_title', pinTitle);
            
            if (document.getElementById('pin-show-owner').checked) params.set('show_owner', 'true');
          }
          break;
          
        case 'top-langs':
          username = document.getElementById('langs-username').value.trim();
          if (username) {
            endpoint = '/api/top-langs';
            params.set('username', username);
            valid = true;
            
            const langsTitle = document.getElementById('langs-title').value;
            if (langsTitle) params.set('custom_title', langsTitle);
            
            const layout = document.getElementById('langs-layout').value;
            if (layout !== 'normal') params.set('layout', layout);
            
            const langsCount = document.getElementById('langs-count').value;
            if (langsCount && langsCount !== '5') params.set('langs_count', langsCount);
          }
          break;
          
        case 'streak':
          username = document.getElementById('streak-username').value.trim();
          if (username) {
            endpoint = '/api/streak';
            params.set('username', username);
            valid = true;
            
            const streakTitle = document.getElementById('streak-title').value;
            if (streakTitle) params.set('custom_title', streakTitle);
          }
          break;
          
        case 'gist':
          const gistId = document.getElementById('gist-id').value.trim();
          if (gistId) {
            endpoint = '/api/gist';
            params.set('id', gistId);
            valid = true;
            
            if (document.getElementById('gist-show-owner').checked) params.set('show_owner', 'true');
          }
          break;
          
        case 'wakatime':
          username = document.getElementById('wakatime-username').value.trim();
          if (username) {
            endpoint = '/api/wakatime';
            params.set('username', username);
            valid = true;
            
            const wakaTitle = document.getElementById('wakatime-title').value;
            if (wakaTitle) params.set('custom_title', wakaTitle);
            
            const wakaLayout = document.getElementById('wakatime-layout').value;
            if (wakaLayout !== 'normal') params.set('layout', wakaLayout);
          }
          break;
      }
      
      const baseUrl = window.location.origin;
      const fullUrl = valid ? baseUrl + endpoint + '?' + params.toString() : '';
      
      return { url: fullUrl, valid };
    }

    // Update preview
    function updatePreview() {
      const { url, valid } = buildUrl();
      const previewFrame = document.getElementById('previewFrame');
      const generatedUrl = document.getElementById('generatedUrl');
      const copyBtn = document.getElementById('copyBtn');
      const openBtn = document.getElementById('openBtn');
      
      generatedUrl.textContent = url || 'Enter a username to generate URL';
      copyBtn.disabled = !valid;
      
      if (valid) {
        openBtn.href = url;
        previewFrame.innerHTML = '<img src="' + url + '" alt="Card Preview" onerror="this.parentNode.innerHTML=\'<span class=\\'placeholder\\'>Error loading preview. Check username.</span>\'">';
      } else {
        openBtn.href = '#';
        previewFrame.innerHTML = '<span class="placeholder">Configure your card to see the preview</span>';
      }
    }

    // Copy to clipboard
    const copyBtn = document.getElementById('copyBtn');
    const toast = document.getElementById('toast');
    
    copyBtn.addEventListener('click', () => {
      const { url, valid } = buildUrl();
      if (valid) {
        navigator.clipboard.writeText(url).then(() => {
          toast.classList.add('show');
          setTimeout(() => {
            toast.classList.remove('show');
          }, 2000);
        });
      }
    });

    // Add event listeners to all inputs
    document.querySelectorAll('input, select').forEach(el => {
      el.addEventListener('input', updatePreview);
      el.addEventListener('change', updatePreview);
    });

    // Checkbox changes
    document.querySelectorAll('input[type="checkbox"]').forEach(el => {
      el.addEventListener('change', updatePreview);
    });

    // Initial update
    updatePreview();
  </script>
</body>
</html>
  `;

  res.setHeader("Content-Type", "text/html");
  res.send(html);
};
