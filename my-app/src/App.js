import React, {useState} from "react";
import './styles/App.css';
import PostItem from "./components/PostItem";
import PostList from "./components/PostList";

function App() {
    const [posts, setPost] = useState([
        {id: 1, title: 'JavaScript 1', body: 'Description'},
        {id: 2, title: 'JavaScript 2', body: 'Description'},
        {id: 3, title: 'JavaScript 3', body: 'Description'}
    ]);

    return (
        <div className="App">
            <PostList posts={posts} title= "Посты JS"/>
        </div>
    );
}

export default App;
