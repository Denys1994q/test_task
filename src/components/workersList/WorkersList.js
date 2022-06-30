// стилі і картинки 
import './workersList.scss'
import Spinner from '../spinner/Spinner'
// хуки 
import { useEffect, useState } from 'react'
import { useHttp } from '../../hooks/http.hooks'

const WorkersList = () => {
    const [users, setUsers] = useState([]); // початковий масив, який приходить з серверу 
    const [sortedUsers, setSortedUsers] = useState([]); // відсортований масив, який показується на сторінці 
    const [start, setStart] = useState(1); // номер сторінки бекенду, з якої беруться users 
    const [usersEnded, setUsersEnded] = useState(false) // вимкнути кнопку, якщо закінчилися користувачі
    const [loading, setLoading] = useState(true); // загрузка даних із серверу
    const [error, setError] = useState(false); // відображення помилки при запиті на сервер  

    const { request } = useHttp() // хук для надсилання запитів на сервер

    // ф-ія для отримання даних з серверу 
    const getData = () => {
        setStart(start + 1)
        request(`https://frontend-test-assignment-api.abz.agency/api/v1/users?page=${start}&count=6`)
            .then(onUsersListLoaded)
            .catch(onError)
    }
    const onUsersListLoaded = (newUsers) => {
        let ended = false;
        if (newUsers.users.length < 6) {
            ended = true;
        }
        setUsers([...users, ...newUsers.users]);
        setUsersEnded(usersEnded => ended);
        setLoading(loading => false);
    }
    const onError = () => {
        setError(true);
        setLoading(loading => false);
    }

    // ф-ія для сортування users 
    const sortUsers = () => {
        const newArr = [...users];
        // сортує від більшого до меншого по даті реєстрації 
        const sorted = newArr.sort((a, b) => b.registration_timestamp - a.registration_timestamp)
        setSortedUsers(sorted)
    }

    // показати героїв при першому завантаженні сторінки 
    useEffect(() => {
        getData()
    }, [])

    // сортувати користувачів, коли оновлюється стейт users
    useEffect(() => {
        sortUsers()
    }, [users])

    const cardsWithUsers = (arr) => {
        const items = arr.map(item => {
            return (
                <li key={item.id} className='workers-inner-wrapper-list-item'>
                    <img src={item.photo} alt="workerPhoto" />
                    <p className='workers-item-name'>{item.name}</p>
                    <p className='workers-item-position'>{item.position} </p>
                    <p className='workers-item-email'>{item.email}</p>
                    <p className='workers-item-tel'>{item.phone}</p>
                </li>
            )
        })

        return (
            <div className="workers-inner-wrapper">
                <ul className="workers-inner-wrapper-list">
                    {items}
                </ul>
            </div>
        )
    }

    const items = cardsWithUsers(sortedUsers);

    // демонструємо різний контент залежно від states 
    const loadingContent = loading ? <Spinner /> : null;
    const content = !loading ? items : null;
    const errorContent = error ? <div style={{'width': '300px', 'margin': '0 auto', 'textAlign': 'center'}}>Сталася помилка</div> : null;

    return (
        <div className="workers-wrapper">
            <div className="workers-container">
                    <div className="workers-inner">
                        <h2 className="workers-inner-heading">Working with GET request</h2>
                        {loadingContent}
                        {content}
                        {errorContent}
                    </div>
                    <button
                        onClick={() => getData()}
                        className='btn btn-center'
                        style={{ 'display': usersEnded ? 'none' : 'block' }} >
                        Show More
                    </button>
            </div>
        </div>
    )
}

export default WorkersList;