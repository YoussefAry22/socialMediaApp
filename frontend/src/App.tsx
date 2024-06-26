import { Route, Routes } from 'react-router-dom';
import './globals.css';
import { Home } from './_root/pages';
import SignupForm from './_auth/forms/SignupForm';
import SigninForm from './_auth/forms/SigninForm';
import RootLayout from './_root/RootLayout';
import AuthLayout from './_auth/AuthLayout';
import { Toaster } from "@/components/ui/toaster"
import Explore from './_root/pages/Explore';
import Saved from './_root/pages/Saved';
import AllUsers from './_root/pages/AllUsers';
import CreatePost from './_root/pages/CreatePost';
import EditPost from './_root/pages/EditPost';
import Profile from './_root/pages/Profile';
import UpdateProfile from './_root/pages/UpdateProfile';
import PostDetails from './_root/pages/PostDetails';
import CreateEvent from './_root/pages/CreateEvent';
import EventDetails from './_root/pages/EventDetails';
import EditEvent from './_root/pages/EditEvent';
import CreateVote from './_root/pages/CreateVote';
import Vote from './_root/pages/Vote';


const App = () => {
  return (
    <main className='flex h-screen'>
        <Routes>
            <Route element={<AuthLayout/>}>
            {/* public routes */}
              <Route path="/sign-in" element={<SigninForm/>} />
              <Route path="/sign-up" element={<SignupForm/>} />
            </Route> 
            {/* private routes */}
            {/* private routes */}
            <Route element={<RootLayout />}>
                <Route index element={<Home />} />
                <Route path="/events" element={<Explore />} />
                <Route path="/saved" element={<Saved />} />
                <Route path="/all-users" element={<AllUsers />} />
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/update-post/:id" element={<EditPost />} />
                <Route path="/posts/:id" element={<PostDetails />} />
                <Route path="/profile/:id/" element={<Profile />} />
                <Route path="/update-profile/" element={<UpdateProfile />} />
                <Route path="/create-event/" element={<CreateEvent />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/update-event/:id" element={<EditEvent />} />
                <Route path="/create-vote/" element={<CreateVote />} />
                <Route path="/votes/" element={<Vote/>} />
            </Route> 

        </Routes>
        <Toaster/>
    </main>
  );
};

export default App;
