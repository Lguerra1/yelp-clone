import React, { useContext, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import RestaurantFinder from '../apis/RestaurantFinder';
import AddReview from '../components/AddReview';
import Reviews from '../components/Reviews';
import StarRating from '../components/StarRating';
import { RestaurantsContext } from '../context/RestaurantsContext';

const RestaurantDetailPage = () => {
    const { id } = useParams();
    const { selectedRestaurant, setSelectedRestaurant } = useContext(RestaurantsContext)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await RestaurantFinder.get(`/${id}`);
                setSelectedRestaurant(response.data.data)
            } catch (err) {
                console.log(err);
            }
        }
        fetchData()
    }, [])

    const renderRating = (restaurant) => {
        if (!restaurant.count) {
            return <span className="text-warning ml-1">0 reviews</span>
        }
        return <>
            <StarRating rating={restaurant.average_rating} />
            <span className="text-warning ml-1">({restaurant.count})</span>
        </>
    }
    return (
        <div>
            <div>{selectedRestaurant && (
                <>
                    <h1 className='text-center display-1'>{selectedRestaurant.restaurant.name}</h1>
                    <div className="text-center">{renderRating(selectedRestaurant.restaurant)}</div>
                    <div className="mt-3">
                        <Reviews reviews={selectedRestaurant.reviews} />
                    </div>
                    <AddReview />
                </>
            )}</div>
        </div>
    )
}

export default RestaurantDetailPage
