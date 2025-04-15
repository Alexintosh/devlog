import { useState, useEffect, useRef } from 'react'
import './App.css'
import { TrayIcon } from '@tauri-apps/api/tray';
import { Menu } from '@tauri-apps/api/menu';
import { defaultWindowIcon } from '@tauri-apps/api/app';
import { open as openDialog } from '@tauri-apps/plugin-dialog';
import { open, writeTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';

function App() {
  const [message, setMessage] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedFile, setSelectedFile] = useState('');
  const trayInitialized = useRef(false);
  const [fileValue, setFileValue] = useState(null);

  useEffect(() => {
    let tray;
    const createTray = async () => {
      // Prevent double initialization
      if (trayInitialized.current) return;
      trayInitialized.current = true;
      
      console.log('Creating tray');
      const quitItem = {
        id: 'quit',
        text: 'Quit',
        action: async () => {
          console.log('Quit action triggered');
        }
      };

      const SettingsItem = {
        id: 'setting',
        text: 'Settings',
        action: async () => {
          setShowSettings(true);
        }
      };

      const menu = await Menu.new({
        items: [SettingsItem, quitItem]
      });

      tray = await TrayIcon.new({
        icon: await defaultWindowIcon(),
        tooltip: 'My Tauri App',
        menu: menu,
        menuOnLeftClick: true,
      });

      tray.onTrayEvent((event) => {
        console.log('Tray event:', event);
      });
    };

    createTray().catch(console.error);

    return () => {
      tray?.dispose();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    console.log('Message submitted:', message);
    if (fileValue) {
      console.log('Writing to file:', fileValue);
      writeTextFile(fileValue, `\n${(new Date()).toLocaleString()} ${message}`, {append: true});
    } else {
      console.log('No file selected');
    }

    setMessage('');
  };

  const handleFileSelect = async () => {
    try {
      const selected = await openDialog({
        multiple: false,
        directory: false,
        append: true,
      });

      if (selected) {
        console.log('Selected file:', selected);
        setSelectedFile(selected);
        setFileValue(selected);
      }
    } catch (err) {
      console.error('Error selecting file:', err);
    }
  };

  return (
    <div className="app-container" data-tauri-drag-region>
      {showSettings ? (
        <div className="settings-container" style={{ padding: '20px' }}>
          <h3>Settings</h3>
          <div style={{ marginBottom: '20px' }}>
            <button onClick={handleFileSelect}>Select File</button>
            {selectedFile && (
              <p style={{ marginTop: '10px', wordBreak: 'break-all' }}>
                Selected file: {selectedFile}
              </p>
            )}
          </div>
          <button onClick={() => setShowSettings(false)}>Back</button>
        </div>
      ) : (
        <div className="chat-input-container">
          <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex' }}>
            <input
              type="text"
              className="chat-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="log..."
              autoFocus
            />
          </form>
        </div>
      )}
    </div>
  );
}

export default App
