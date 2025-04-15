import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { TrayIcon } from '@tauri-apps/api/tray';
import { Menu } from '@tauri-apps/api/menu';
import { defaultWindowIcon } from '@tauri-apps/api/app';

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let tray;
    const createTray = async () => {
      console.log('Creating tray');
      const quitItem = {
        id: 'quit',
        text: 'Quit',
        action: async () => {
          console.log('Quit action triggered');
        }
      };

      const menu = await Menu.new({
        items: [quitItem]
      });

      tray = await TrayIcon.new({
        icon: await defaultWindowIcon(),
        tooltip: 'My Tauri App',
        menu: menu,
        menuOnLeftClick: false, // Optional: Set to true to show menu on left click
      });

      // Optional: Add listener for general tray events
      tray.onTrayEvent((event) => {
        console.log('Tray event:', event);
      });

      tray.setShowMenuOnLeftClick(true);

    };

    createTray().catch(console.error);

    // Cleanup function to remove the tray icon when the component unmounts
    return () => {
      tray?.dispose();
    };
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Suca</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
