import { useContext } from "react";
import { StoreContext } from "components/StoreProvider";

const useApplicationContext = () => useContext(StoreContext);

export default useApplicationContext;
