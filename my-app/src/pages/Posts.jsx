import React, {useEffect, useRef, useState} from "react";
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
import {useObserver} from "../hooks/useObserver";
import MySelect from "../components/UI/select/MySelect";


function Posts() {
    const [posts, setPosts] = useState([]);
    const [filter, setFilter] = useState({sort: '', query: ''});
    const [modal, setModal] = useState(false);
    const  sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query);
    const [isPostsLoading, setIsPostsLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const lastElement = useRef();

    useObserver(lastElement, page < totalPages, isPostsLoading, () => {
        setPage(page + 1);
    });

    useEffect(() => {
        fetchPosts(limit, page);
    }, [page, limit]);

    function createPost(newPost) {
        setPosts( [...posts, newPost]);
        setModal(false);
    }

    async function fetchPosts() {
        setIsPostsLoading(true);
        const response = await PostService.getAll(limit, page);
        setPosts([...posts, ...response.data]);
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
            <MySelect
                value={limit}
                onChange={value => setLimit(value)}
                defaultValue="Кол-во элементов на странице"
                options={[
                    {value: 5, name: '5'},
                    {value: 10, name: '10'},
                    {value: 25, name: '25'},
                    {value: -1, name: 'Показать все'},
                ]}
            />

            <PostList remove={removePost} posts={sortedAndSearchedPosts} title= "Посты JS"/>
            <div ref={lastElement} style={{height: 20, background: 'red'}}/>
            {isPostsLoading &&
                <div style={{display: 'flex' , justifyContent: 'center', marginTop: 50}}><Loader /></div>
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
