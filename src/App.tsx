import { useEffect, useState } from "react";
import { AxieFigure } from "./components/avatar/AxieFigure";
import { DotContainer } from "./components/ui/dot-container";
import { Label } from "./components/ui/label";
import { Progress } from "./components/ui/progress";
console.log = console.warn = console.error = () => {};

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
  return (
    <div className="w-screen h-screen flex flex-1 justify-center items-center">
      <DotContainer>
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
      </DotContainer>
    </div>
  );
}

export default App;
