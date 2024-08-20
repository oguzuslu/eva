import { mapGetters } from 'vuex';
import { Api } from '../../helpers/Api/apiConfig'
import router from '../../router'

export default {
    namespaced: true,
    state: {
        userData: null,
        userChartData: null,
        userTableData: null,
    },
    mutations: {
        setUserData(state, userData) {
            state.userData = userData;
        },
        setUserChartData(state, userChartData) {
            state.userChartData = userChartData;
        },
        setUserTableData(state, userTableData) {

            const skuList = userTableData.tableData.skuList.map(item => {
                const refundRateData = userTableData.refundRate.find(refundRate => refundRate.sku.sku === item.sku);
                return { ...item, refundRateData: refundRateData ? refundRateData : null };
            });

            state.userTableData = { ...userTableData, tableData: { ...userTableData.tableData, skuList } };
        }
    },
    getters: {
        userData(state) {
            return state.userData;
        },
        userChartData(state) {
            return state.userChartData;
        },
        userTableData(state) {
            return state.userTableData;
        }
    },
    actions: {
        async login({ commit }, data) {
            // console.log('data ', data);
            try {
                const response = await Api('POST', '/user/user-information', { "email": data.email });
                commit('setUserData', response.data.Data.user);
                localStorage.setItem('userData', JSON.stringify(response.data.Data.user));
                // console.log('suser', response.data.Data.user);
            } catch (error) {
                console.error(error);
            }
            router.push('/');
        },
        async getChartData({ commit, getters }, data) {
            // console.log('dataday', data);
            // console.log('datadaygetters', getters.userData);

            try {
                const response = await Api('POST', '/data/daily-sales-overview/', {
                    "customDateData": null,
                    "day": data.day,
                    "excludeYoYData": true,
                    "marketplace": getters.userData.store[0].marketplaceName,
                    "requestStatus": 0,
                    "sellerId": getters.userData.store[0].storeId
                });


                commit('setUserChartData', response.data.Data.item);
                // localStorage.setItem('userChartData', JSON.stringify(response.data.Data.item));
            } catch (error) {
                console.error(error);
            }
        },
        async getTableData({ commit, getters }, data) {
            // console.log('table data points', data);

            try {
                const response = await Api('POST', '/data/daily-sales-sku-list/', {
                    "marketplace": getters.userData.store[0].marketplaceName,
                    "sellerId": getters.userData.store[0].storeId,
                    "salesDate": data.salesDate,
                    "salesDate2": data.salesDate2,
                    "pageSize": data.pageSize,
                    "pageNumber": data.pageNumber,
                    "isDaysCompare": data.isDaysCompare
                });
                // console.log('table data', response);
                if (response.data.ApiStatusCode == 200) {
                    const refundRate = await Api('POST', '/data/get-sku-refund-rate/', {
                        "marketplace": getters.userData.store[0].marketplaceName,
                        "sellerId": getters.userData.store[0].storeId,
                        "skuList": response.data.Data.item.skuList,
                        "requestedDay": 0,

                    });

                    // console.log('refundRate', refundRate.data.Data);
                    commit('setUserTableData', { tableData: response.data.Data.item, refundRate: refundRate.data.Data });
                }

                //   localStorage.setItem('userChartData', JSON.stringify(response.data.Data.item));
            } catch (error) {
                console.error(error);
            }
        }
    },
    getters: {
        userData(state) {
            // Eğer state içinde userData yoksa localStorage'dan al
            return state.userData || JSON.parse(localStorage.getItem('userData'));
        },
        userChartData(state) {
            // Eğer state içinde userChartData yoksa localStorage'dan al
            return state.userChartData || JSON.parse(localStorage.getItem('userChartData'));
        },
        userTableData(state) {
            return state.userTableData
        }
    }
};