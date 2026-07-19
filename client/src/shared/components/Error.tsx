import { useAppDispatch } from "../../app/hooks";
import { setError } from "../../features/connection/connectionSlice";

interface ErrorProps {
  message: string;
}

export default function Error({ message }: ErrorProps) {
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(setError(null));
  };

  return (
    <div className="fixed top-0 left-0 right-0 flex justify-between items-center w-2/5 mx-auto p-2 border-x-2 border-b-2 border-black bg-skin-gradient rounded-b-lg">
      <span>{message}</span>
      <button type="button" onClick={handleClose} className="cursor-pointer">
        Close
      </button>
    </div>
  );
}
