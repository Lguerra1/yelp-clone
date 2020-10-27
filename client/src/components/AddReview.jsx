import React from 'react'
import { useState } from 'react'
import RestaurantFinder from '../apis/RestaurantFinder';
import { useParams, useLocation, useHistory } from 'react-router-dom';

const AddReview = () => {
    const history = useHistory();
    const {pathname} = useLocation();
    const { id } = useParams();
    const [name, setName] = useState('');
    const [rating, setRating] = useState('Rating');
    const [reviewText, setReviewText] = useState('');
    
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            const response = await RestaurantFinder.post(`/${id}/addReview`, {
                name,
                review: reviewText,
                rating
            })
            console.log(response)
        } catch (err) {
            console.log(err)
        }

        //my method of reloading page
        // window.location.reload();

        //what was shown in video
        history.push("/");
        history.push(pathname);
    }

    return (
        <div className="mb-2">
            <form action="">
                <div className="form-row">
                    <div className="form-group col-8">
                        <label htmlFor="name">Name</label>
                        <input
                            value={name}
                            id="name"
                            placeholder="name"
                            type="text"
                            className="form-control"
                            onChange={(e) => setName(e.target.value)}
                        >
                        </input>
                    </div>
                    <div className="form-group col-4">
                        <label htmlFor="rating">Rating</label>
                        <select
                            value={rating}
                            id="rating"
                            className="custom-select"
                            onChange={(e) => setRating(e.target.value)}
                        >
                            <option disabled>Rating</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="Review">Review</label>
                    <textarea
                        value={reviewText}
                        id="Review"
                        className="form-control"
                        onChange={(e) => setReviewText(e.target.value)}
                    >
                    </textarea>
                </div>
                <button type="submit" onClick={handleSubmitReview} className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default AddReview