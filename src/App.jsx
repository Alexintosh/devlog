import { useState, useEffect, useRef } from 'react'
import './App.css'
import { TrayIcon } from '@tauri-apps/api/tray';
import { Menu } from '@tauri-apps/api/menu';
import { defaultWindowIcon } from '@tauri-apps/api/app';

function App() {
  const [message, setMessage] = useState('');
  const trayInitialized = useRef(false);

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
          console.log('Settings');
        }
      };

      const menu = await Menu.new({
        items: [SettingsItem, quitItem]
      });

      tray = await TrayIcon.new({
        icon: await defaultWindowIcon(),
        tooltip: 'My Tauri App',
        menu: menu,
        menuOnLeftClick: true, // Optional: Set to true to show menu on left click
      });

      // Optional: Add listener for general tray events
      tray.onTrayEvent((event) => {
        console.log('Tray event:', event);
      });
    };

    createTray().catch(console.error);

    // Cleanup function to remove the tray icon when the component unmounts
    return () => {
      tray?.dispose();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    console.log('Message submitted:', message);
    setMessage('');
  };

  return (
    <div className="app-container" data-tauri-drag-region>
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
    </div>
  );
}

export default App
