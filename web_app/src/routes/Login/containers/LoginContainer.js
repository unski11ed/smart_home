import React from 'react';
import { connect } from 'react-redux'
import { Paper, TextField, RaisedButton, FontIcon, Snackbar } from 'material-ui';

import { authenticate, clearErrorMessage } from './../modules/login';

const loginWindowStyle = {
    maxWidth: '420px',
    padding: '20px 30px',
    position: 'relative',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
}

class LoginContainer extends React.Component {
    componentDidMount() {
        this.state = {
            email: '',
            password: ''
        }
    }

    setEmail(email) {
        this.setState(Object.assign({}, this.state, {
            email: email
        }));
    }

    setPassword(password) {
        this.setState(Object.assign({}, this.state, {
            password: password
        }));
    }

    authenticate() {
        const { email, password } = this.state;
        this.props.authenticate(email, password);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.userToken) {
            this.props.history.push('/');
        }
    }

    render() {
        return (
            <div style={ {height: '100%'} }>
                <Paper style={ loginWindowStyle }>
                    <h2>Zaloguj</h2>

                    <form onSubmit={ (e) => {
                        e.preventDefault();
                        this.authenticate();
                    }}>
                        <TextField
                            fullWidth
                            hintText="np. jan.kowalski@gmail.com"
                            floatingLabelText="Email"
                            type="email"
                            onChange={ (e) => { this.setEmail(e.target.value) } }
                        />

                        <TextField
                            fullWidth
                            hintText="Password Field"
                            floatingLabelText="Password"
                            type="password"
                            onChange={ (e) => { this.setPassword(e.target.value) } }
                        />

                        <div style={ {marginTop: '30px'} }>
                            <RaisedButton
                                type="submit"
                                label="Zaloguj"
                                labelPosition="before"
                                fullWidth
                                disabled={ this.props.authInProgress }
                                primary={true}
                            />
                        </div>
                    </form>
                </Paper>

                <Snackbar
                    open={!!this.props.errorMessage}
                    message={this.props.errorMessage}
                    autoHideDuration={ 5000 }
                    onRequestClose={ () => this.props.clearErrorMessage() }
                />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    authInProgress: state.auth.authInProgress,
    errorMessage: state.auth.errorMessage,
    userToken: state.auth.userToken
});

const mapActionCreators = {
    authenticate,
    clearErrorMessage
};

export default connect(mapStateToProps, mapActionCreators)(LoginContainer);
