import axios from 'axios';

export default ({req}) => {

    if (typeof window === 'undefined') {
        // We are on the server

        return axios.create({
            // baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            baseURL: 'http://ticketing-app-sayne.xyz',
            headers: req.headers
        });
    } else {
        // we are on the server
        
        return axios.create({
            baseURL: '/'
        });
    }

}; 