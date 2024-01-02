import axios from 'axios';
import { api } from './url';
const postImage = async (name, url, is_man, authToken) => {
    console.log(url);
    try {
        const response = await axios.post(
            `${api}image/save`,
            {
                name: `image-product ${name}`,
                url,
                is_main: is_man,
            },

            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
            },
        );
        return response;
    } catch (error) {
        console.log('error sign in' + error.message);
    }
};

export default postImage;
