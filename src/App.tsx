import { Button } from "@/components/ui/button";
import { DotContainer } from "@/components/ui/dot-container";

function App() {
  return (
    <div className="not-prose m400:text-sm ">
      <DotContainer>
        <div className="flex flex-col gap-5">
          <Button>Hello world</Button>
        </div>
      </DotContainer>
    </div>
  );
}

export default App;
