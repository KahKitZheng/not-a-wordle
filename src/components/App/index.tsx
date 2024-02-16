import { RouterProvider, createBrowserRouter } from "react-router-dom";

// Pages
import HomePage from "../../routes/Home/HomePage";
import CreateRoomPage from "../../routes/CreateRoom/CreateRoomPage";
import SingleplayerPage from "../../routes/Singleplayer/SinglePlayerPage";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/play",
      element: <SingleplayerPage />,
    },
    {
      path: "/create-room",
      element: <CreateRoomPage />,
    },
  ]);

  return <RouterProvider router={router} />;
}
