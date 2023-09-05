import { useEffect } from "preact/hooks";

export default function Debug<T,>(props: T) {
  useEffect(() => {
    console.log(props);
  }, []);
  return <div></div>;
}
