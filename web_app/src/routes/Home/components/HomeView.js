import React from 'react'
import { connect } from 'react-redux';
import { Paper } from 'material-ui';
import { startListening } from './../modules/temps';
import classes from './HomeView.scss'
import _ from 'underscore';
import numeral from 'numeral';
import uid from 'node-uuid';

const tempsMap = [
    {
        address: '10a25c9c18053',
        name: 'Szary czujnik'
    },
    {
        address: '1047139c18017',
        name: 'Czarny czujnik'
    }
];

const getTemps = (temps) => _.map(temps, temp => Object.assign({}, temp, {
    name: _.findWhere(tempsMap, { address: temp.address }).name
}));

const renderTemp = (temp) => (
    <div key={ uid.v4() } className={ classes.tempContainer }>
        <h2 className={ classes.tempName }>
            { temp.name }
            <small>({ temp.address })</small>
        </h2>
        <p>
            <span className={ classes.tempValue }>
                { temp.value.toFixed(1).replace('.', ',') }
            </span>
            <span className={ classes.tempUnit }>
                <sup>o</sup>C
            </span>
        </p>
    </div>
)

const containerStyle = {
    width: '100%',
    height: '100%',
    backgroundColor: '#42A5F5',
    marginTop: '-20px',
    padding: '0 30px'
};

class HomeContainer extends React.Component {
    componentDidMount() {
        this.props.startListening();
    }

    render() {
        const temps = getTemps(this.props.temps);

        return (
            <div style={ containerStyle }>
                <div className={ classes.tempsWrap }>
                {
                    _.map(temps, temp => renderTemp(temp))
                }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state => ({
    temps: state.temps.temps
}));

const mapActionCreators = {
    startListening
};

export default connect(mapStateToProps, mapActionCreators)(HomeContainer);
