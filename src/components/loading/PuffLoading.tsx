import { Skeleton } from "../ui/skeleton";
import s from "./styles.module.css";

interface PuffLoadingProps {
  size?: number;
}

export const PuffLoading = (props: PuffLoadingProps) => {
  const { size } = props;
  return (
    <div className={["absolute", s.loadingWrapper].join(" ")}>
      <Skeleton className="w-20 h-20 rounded-full" />
    </div>
  );
};
