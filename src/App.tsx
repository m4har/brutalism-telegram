import { useEffect, useState } from "react";
import { AxieFigure } from "./components/avatar/AxieFigure";
import { DotContainer } from "./components/ui/dot-container";
import { Label } from "./components/ui/label";
import { Progress } from "./components/ui/progress";
import { Switch } from "./components/ui/switch";
console.log = console.warn = console.error = () => {};

const TelegramInfo = () => {
  const [telegramData, setTelegramData] = useState(null);

  useEffect(() => {
    // Cek apakah window.Telegram tersedia
    if (window.Telegram && window.Telegram.WebApp) {
      const data = {
        user: window.Telegram.WebApp.initDataUnsafe.user,
        chat: window.Telegram.WebApp.initDataUnsafe.chat,
        app: window.Telegram.WebApp.initDataUnsafe.app,
        platform: window.Telegram.WebApp.platform,
      };
      setTelegramData(data);
    } else {
      console.log("Telegram Web App API tidak tersedia.");
    }
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Informasi Telegram</h1>
      {telegramData ? (
        <div>
          <h2>User Info</h2>
          <pre>{JSON.stringify(telegramData.user, null, 2)}</pre>

          <h2>Chat Info</h2>
          <pre>{JSON.stringify(telegramData.chat, null, 2)}</pre>

          <h2>App Info</h2>
          <pre>{JSON.stringify(telegramData.app, null, 2)}</pre>

          <h2>Platform</h2>
          <p>{telegramData.platform}</p>
        </div>
      ) : (
        <p>Loading data from Telegram...</p>
      )}
    </div>
  );
};

const useRandomNumber = (min = 10, max = 100, intervalMs = 2000) => {
  const [randomNumber, setRandomNumber] = useState(0);

  useEffect(() => {
    // Function to generate a random number between min and max
    const generateRandomNumber = () => {
      const number = Math.floor(Math.random() * (max - min + 1)) + min;
      setRandomNumber(number);
    };

    // Set an interval to generate a random number every intervalMs milliseconds
    const interval = setInterval(() => {
      generateRandomNumber();
    }, intervalMs);

    // Cleanup the interval when the component using the hook unmounts
    return () => clearInterval(interval);
  }, [min, max, intervalMs]);

  return randomNumber;
};

function App() {
  const health = useRandomNumber();
  const happy = useRandomNumber();
  const Hungry = useRandomNumber();
  const [showData, setShowData] = useState(false);
  return (
    <div className="w-screen h-screen flex flex-1 justify-center items-center flex-col">
      <div className="items-center flex">
        <Switch onClick={() => setShowData(!showData)} checked={showData} />
        <Label className="ml-3">show telegram data</Label>
      </div>
      <DotContainer>
        {showData ? (
          <TelegramInfo />
        ) : (
          <>
            {/* bar */}
            <div className="absolute w-full">
              <div className="grid grid-cols-3 gap-3 m-2">
                <div>
                  <Label>Health</Label>
                  <Progress value={health} />
                </div>
                <div>
                  <Label>Happy</Label>
                  <Progress value={happy} />
                </div>
                <div>
                  <Label>Hungry</Label>
                  <Progress value={Hungry} />
                </div>
              </div>
            </div>
            <div className="w-[250px] h-[250px]">
              <AxieFigure />
            </div>
          </>
        )}
      </DotContainer>
    </div>
  );
}

export default App;
