import React, {useEffect, useState} from "react";
import {usePosts} from "../hooks/usePosts";
import PostService from "../API/PostService";
import {getPageCount} from "../utils/pages";
import MyButton from "../components/UI/button/MyButton";
import MyModal from "../components/UI/MyModal/MyModal";
import PostForm from "../components/PostForm";
import PostFilter from "../components/PostFilter";
import PostList from "../components/PostList";
import Loader from "../components/UI/Loader/Loader";
import Pagination from "../components/UI/pagination/Pagination";


function Posts() {
    const [posts, setPosts] = useState([]);
    const [filter, setFilter] = useState({sort: '', query: ''});
    const [modal, setModal] = useState(false);
    const  sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query);
    const [isPostsLoading, setIsPostsLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);


    useEffect(() => {
        fetchPosts();
    }, [page]);

    function createPost(newPost) {
        setPosts( [...posts, newPost]);
        setModal(false);
    }

    async function fetchPosts() {
        setIsPostsLoading(true);
        const response = await PostService.getAll(limit, page);
        setPosts(response.data);
        setIsPostsLoading(false);
        const totalCount = (response.headers['x-total-count']);
        setTotalPages(getPageCount(totalCount, limit));
    }

    // получаем пост из дочернего
    function removePost(post) {
        setPosts(posts.filter(p => p.id !== post.id));
    }

    function changePage(page) {
        setPage(page);
    }

    return (
        <div className="App">
            <button onClick={fetchPosts}>GET POSTS</button>
            <MyButton onClick={() => setModal(true)}>
                Создать пост
            </MyButton>
            <MyModal visible={modal} setVisible={setModal}>
                <PostForm create={createPost}/>
            </MyModal>
            <PostFilter
                filter={filter}
                setFilter={setFilter}
            />
            {isPostsLoading
                ? <div style={{display: 'flex' , justifyContent: 'center', marginTop: 50}}><Loader /></div>
                : <PostList remove={removePost} posts={sortedAndSearchedPosts} title= "Посты JS"/>
            }
            <Pagination
                page={page}
                changePage={changePage}
                totalPages={totalPages}
            />
        </div>
    );
}

export default Posts;
