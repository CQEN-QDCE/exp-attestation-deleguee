const Auth = {
    authenticate() {
       localStorage.setItem('token','auth');
    },

    signout() {
        localStorage.removeItem('token');
    },
    
    getAuth() {
        return localStorage.getItem('token');
    }
};

export default Auth;