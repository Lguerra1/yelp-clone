import React from 'react';
import AddRestaurant from '../components/AddRestaurant';
import Header from '../components/Header';
import RestaurantsList from '../components/RestaurantsList';


const Home = () => {
    return (
        <>
            <Header />
            <AddRestaurant />
            <RestaurantsList />
        </>
    )
}

export default Home
