import axios from 'axios';
import { api } from './url';
const putConfirm_buy = async (id, authToken) => {
    console.log(id, authToken);
    try {
        await axios({
            method: 'put',
            url: `${api}bill/confirm-buy/false`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
            },
            data: id,
        });
    } catch (error) {
        console.log('error sign in' + error.message);
    }
};

export default putConfirm_buy;
