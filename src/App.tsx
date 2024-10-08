import { DotContainer } from "@/components/ui/dot-container";
import { AxieFigure } from "./components/avatar/AxieFigure";

function App() {
  return (
    <div className="w-screen flex items-center justify-center h-screen p-5">
      <DotContainer>
        <div>
          <AxieFigure />
        </div>
      </DotContainer>
    </div>
  );
}

export default App;
