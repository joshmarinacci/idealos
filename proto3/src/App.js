import React from 'react';
import logo from './logo.svg';
import './App.css';
import '../node_modules/font-awesome/css/font-awesome.css'

/*

main window
    email viewer
side window
    email composer
third window?
    text editor
dashboard sidebar
    clock
    weather
    calendar/agenda view
    todo list
    notifications that stack up
top menu?
video chat bubble

focus mode button

 */

const MainScreen = ({children}) => {
    return <div id={"main-grid"}>
        {children}
    </div>
}

const Menubar = ({children}) => {
    return <div className={'menubar'}>
        {children}
    </div>
}
const Menu = ({children}) => {
    return <div className={'menu'}>
        {children}
    </div>
}
const Dashboard = ({children}) => {
    return <div className={'dashboard'}>
        {children}
    </div>
}

const Clock = ({}) => {
    return <div>Fri Jun 19 5:48 PM </div>
}

const Weather = ({}) => {
    return <div>Eugene 85º</div>
}
const Todos = ({}) => {
    return <div className={'todos'}>
        <input type="checkbox"/>
        <label>Don't forget the Milk</label>
        <input type="checkbox"/> <label>Remember the milk</label>
        <input type="checkbox"/> <label>Answer all my emails</label>
    </div>
}
const Window = ({className, children}) => {
    return <div className={'window ' + className}>
        <div className={'titlebar'}>
            <button className={"fa fa-window-close"}/>
            <label>Window Title</label>
        </div>
        {children}
    </div>
}
const Videobubble = ({children}) => {
    return <div className={'videobubble'}>
        <img src={'https://placekitten.com/100/100'}/>
    </div>
}
const Musicplayer = ({}) => {
    return <div className={'musicplayer'}>
        <div>2:39</div>
        <div className={'title'}>She Came In Through the Bathroom Window</div>
        <div className={'album-artist'}>Abbey Road - The Beatles</div>
    </div>
}

const Spacer = ({}) => {
    return <div className={'spacer'}>&nbsp;</div>
}

function App() {
  return (
      <MainScreen>
          <Menubar>
              <Menu><label>File</label></Menu>
              <Menu><label>Edit</label></Menu>
              <Menu><label>View</label></Menu>
              <Menu><label>Window</label></Menu>
              <Spacer/>
              <Menu><label className={"fa fa-wifi"}/></Menu>
              <Menu><label className={"fa fa-volume-up"}/></Menu>
              <Menu><label className={"fa fa-battery"}/></Menu>
          </Menubar>
          <Dashboard>
              <Clock/>
              <Musicplayer/>
              <Weather/>
              {/*<Agenda/>*/}
              <Todos/>
              {/*<Notifications/>*/}
          </Dashboard>

          <Window className={'primary'}>
              hello this is a window
          </Window>
          <Window className={'secondary'}>
              the secondary window
          </Window>
          <Window className={'tertiary'}>
              the third window
          </Window>

          <Videobubble x={300} y={200}/>
      </MainScreen>
  );
}

export default App;
