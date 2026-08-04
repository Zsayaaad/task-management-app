import { useRouteError } from "react-router-dom";

const ErrorElement = () => {
  const error = useRouteError();

  console.log(error);

  return <h2 className="text-h2">There was an error...</h2>;
};

export default ErrorElement;
