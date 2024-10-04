import { Button } from "@/components/ui/button";
import { DotContainer } from "@/components/ui/dot-container";

function App() {
  return (
    <div className="w-full flex items-center justify-center h-screen p-5">
      <DotContainer>
        <div>
          <Button>Hello world</Button>
        </div>
      </DotContainer>
    </div>
  );
}

export default App;
