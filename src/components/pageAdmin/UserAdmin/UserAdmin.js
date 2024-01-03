import { Pagination } from '@mui/material';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import getUser from '~/API/Admin/getUser';
import putChangeState from '~/API/Admin/putChangeState';
import searchUser from '~/API/Admin/searchUser';

const UserAdmin = () => {
    const [trackingInfo, setTrackingInfo] = useState([]);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(null);
    const [pageSize, setPageSize] = useState(10);
    const [sort, setSort] = useState('id');
    const [desc, setDesc] = useState(false);
    const [state, setState] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                let response;

                if (searchTerm) {
                    response = await searchUser(searchTerm, page, pageSize, sort, desc, state);
                } else {
                    response = await getUser(page, pageSize, sort, desc, state);
                    if (!totalPage) {
                        setTotalPage(response?.totalPages);
                    }
                }

                let listAcc = response.content;
                listAcc = listAcc.filter(
                    (item) => item?.roles[0] === 'ROLE_BUSINESS' || item?.roles[0] === 'ROLE_CUSTOMER',
                );
                setTrackingInfo(listAcc);

                if (!response) {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [page, pageSize, sort, desc, state, searchTerm]);

    const handleOpenAddUserModal = () => {
        setIsAddUserModalOpen(true);
    };

    const handleCloseAddUserModal = () => {
        setIsAddUserModalOpen(false);
    };

    const handleOpenEditUserModal = (user) => {
        setUserToEdit(user);
        setIsEditUserModalOpen(true);
    };

    const handleCloseEditUserModal = () => {
        setUserToEdit(null);
        setIsEditUserModalOpen(false);
    };

    const handleSaveUser = (newUser) => {
        setTrackingInfo((prevTrackingInfo) => [...prevTrackingInfo, newUser]);
        handleCloseAddUserModal();
    };

    const handleSaveEditedUser = (editedUser) => {
        setTrackingInfo((prevTrackingInfo) =>
            prevTrackingInfo.map((user) => (user.id === editedUser.id ? editedUser : user)),
        );
        handleCloseEditUserModal();
    };

    const handleDeleteUser = (userId) => {
        setTrackingInfo((prevTrackingInfo) => prevTrackingInfo.filter((user) => user.id !== userId));
    };

    const handleAccUser = (user) => {
        const isConfirmed = window.confirm('Bạn có chắc muốn xác nhận?');

        if (isConfirmed) {
            const authToken = JSON.parse(localStorage.getItem('authToken'));
            console.log(authToken);
            if (state === 1) {
                putChangeState(user.id, 0, authToken)
                    .then((status) => {
                        console.log('API call successful. Status:', status);
                        if (status === 202) {
                            toast('Xác nhận tài khoản thành công');
                            window.location.reload();
                        }
                    })
                    .catch((error) => {
                        console.error('API call failed:', error);
                    });
            } else {
                putChangeState(user.id, 1, authToken)
                    .then((status) => {
                        console.log('API call successful. Status:', status);
                        if (status === 202) {
                            toast('Khóa tài khoản thành công');
                            window.location.reload();
                        }
                    })
                    .catch((error) => {
                        console.error('API call failed:', error);
                    });
            }
        } else {
            console.log('Hủy xác nhận');
        }
    };

    return (
        <>
            <div className="track-container">
                <h2>Quản lý User</h2>
                <input
                    style={{ width: '400px' }}
                    type="text"
                    placeholder="Tìm kiếm "
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <ToastContainer />
                {state === 1 ? (
                    <button className="" style={{ backgroundColor: 'red' }} onClick={() => setState(0)}>
                        Khóa tài khoản
                    </button>
                ) : (
                    <button className="" onClick={() => setState(1)}>
                        Xác nhận tài khoản
                    </button>
                )}

                <div className="tracking-header">
                    <div>Username</div>
                    <div>Hình ảnh</div>
                    <div className="adminheader">Email</div>
                    <div>Họ và tên</div>
                    <div>Phân quyền</div>
                    <div>CCCD</div>
                    <div>Địa chỉ</div>
                    <div>Trạng thái</div>
                    <div>Action</div>
                </div>

                {trackingInfo.map((user, index) => (
                    <div className="tracking-info" key={index}>
                        <div>{user.username}</div>
                        <div>
                            <img src={user.image_url} alt={`User ${index + 1}`} />
                        </div>
                        <div className="adminheader">{user.email}</div>
                        <div>{user.name}</div>
                        <div>{user.roles}</div>

                        <div>{user.cic}</div>
                        <div>{user.address}</div>
                        <div>{user.state === 1 ? 'Chưa xác nhận' : 'Đang hoạt động'}</div>

                        <div>
                            <button
                                className=""
                                style={{
                                    backgroundColor: state === 1 ? 'green' : 'red',
                                    color: 'white',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                                onClick={() => handleAccUser(user)}
                            >
                                {state === 1 ? 'Xác nhận' : 'Khóa'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {totalPage && (
                <Pagination
                    className="pagination"
                    onChange={(e, value) => {
                        setPage(value - 1);
                    }}
                    count={totalPage}
                    defaultPage={page + 1}
                    variant="outlined"
                    color="secondary"
                />
            )}
        </>
    );
};

export default UserAdmin;
