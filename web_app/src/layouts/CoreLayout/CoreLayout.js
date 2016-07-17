import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import classes from './CoreLayout.scss'
import '../../styles/core.scss'

export const CoreLayout = ({ children }) => (
    <MuiThemeProvider>
        {children}
    </MuiThemeProvider>
)

CoreLayout.propTypes = {
  children: React.PropTypes.element.isRequired
}

export default CoreLayout
