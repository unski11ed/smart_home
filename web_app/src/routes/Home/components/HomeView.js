import React from 'react'
import { connect } from 'react-redux';
import { Paper } from 'material-ui';
import { startListening } from './../modules/temps';
import _ from 'underscore';
import numeral from 'numeral';
import moment from 'moment';

import classes from './HomeView.scss';

const renderStatEntry = (name, value) => (
    <div>
        <span className={ classes.statName }>{ name }</span>
        <span className={ classes.statValue }>{ value }</span>
    </div>
);

const renderTemp = (temp, index) => (
    <div key={ `temp_entry_${ index }` } className={ classes.tempContainer }>
        <h2 className={ classes.tempName }>
            { temp.name || `Czujnik #${ index + 1 }` }
        </h2>
        <div className={ classes.tempEntry }>
            { temp.address && renderStatEntry('Adres termometru', temp.address) }
            { temp.address && renderStatEntry('Czas pomiaru', temp.time) }
        </div>
        <p>
            <span className={ classes.tempValue }>
                { temp.value.toFixed(1).replace('.', ',') }
            </span>
            <span className={ classes.tempUnit }>
                <sup>o</sup>C
            </span>
        </p>
    </div>
);

const containerStyle = {
    width: '100%',
    height: '100%',
    backgroundColor: '#42A5F5',
    padding: '0 30px'
};

class HomeContainer extends React.Component {
    componentDidMount() {
        this.props.startListening();
    }

    render() {
        const { boards } = this.props;
        const boardsValues = _.values(boards);

        return (
            <div style={ containerStyle }>
                <div className={ classes.tempsWrap }>
                {
                    _.map(boardsValues, board =>  {
                        return _.map(board.temparatures, (temp, i) => renderTemp(temp, i));
                    })
                }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state => ({
    boards: state.temps.boards
}));

const mapActionCreators = {
    startListening
};

export default connect(mapStateToProps, mapActionCreators)(HomeContainer);
