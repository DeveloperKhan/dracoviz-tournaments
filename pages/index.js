import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Router from "next/router";
import Header from "/components/Header/Header.js";
import HeaderLinks from "/components/Header/HeaderLinks.js";
import Footer from "/components/Footer/Footer.js";
import firebase from 'firebase/compat/app';
import ProfilePreview from "../pages-sections/home-sections/ProfilePreview";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";

import styles from "/styles/jss/nextjs-material-kit/pages/homePage.js";
import { Button } from "@material-ui/core";
import TournamentList from "../pages-sections/home-sections/TournamentList";
import ProfileEditModal from "../pages-sections/home-sections/ProfileEditModal";

const useStyles = makeStyles(styles);

const testData = {
  player: {
    name: "Profile 1",
    description: "A rising legend",
    avatar: "https://imagedelivery.net/2qzpDFW7Yl3NqBaOSqtWxQ/Janine.png/public",
    friendCode: "123412341234",
    discord: "Profile1#1234",
    telegram: "@Profile1",
    sessions: [{
      _id: "123",
      name: "Tournament 1",
      playerValues: {
        status: "POKEMON_VISIBLE",
        role: "Host",
        meta: "https://imagedelivery.net/2qzpDFW7Yl3NqBaOSqtWxQ/4cbccdf9-c0a9-4773-d5d1-3a01755e5100/public"
      },
    }, {
      _id: "123",
      name: "Tournament 2",
      playerValues: {
        status: "REGISTER_TEAM",
        role: "Player",
        meta: "https://imagedelivery.net/2qzpDFW7Yl3NqBaOSqtWxQ/14d2649e-67e9-46c7-872b-26a14f72a500/public"
      },
    }, {
      _id: "123",
      name: "Tournament 3",
      playerValues: {
        status: "NOT_STARTED",
        role: "Captain",
        meta: "https://imagedelivery.net/2qzpDFW7Yl3NqBaOSqtWxQ/e300ceed-0161-49fb-da65-c12d39ae5500/public"
      },
    }]
  },
}

export default function Index() {
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [currentModal, setCurrentModal] = useState(null);

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {
      const doesUserExist = !!user;
      setIsSignedIn(doesUserExist);
      if (!doesUserExist) {
        Router.push("/login");
      }
    });
    return () => unregisterAuthObserver();
    // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  const onEditProfile = () => {
    setCurrentModal("profile");
  }

  const closeModal = () => {
    setCurrentModal(null);
  }

  const renderProfile = () => {
    const { player } = testData;
    const { description, name, avatar } = player;
    return (
      <ProfilePreview
        description={description}
        username={name}
        imageUrl={avatar}
        onClick={onEditProfile}
      />
    )
  }

  const renderTournaments = () => {
    const { player } = testData;
    const { sessions } = player;
    return (
      <TournamentList sessions={sessions} />
    )
  }

  const renderEditProfileModal = () => {
    const { player } = testData;
    return (
      <ProfileEditModal 
        open={currentModal === "profile"}
        onClose={closeModal}
        player={player}
      />
    )
  }

  const classes = useStyles();

  return (
    <div>
      <Header
        absolute
        color="white"
        rightLinks={<HeaderLinks isSignedIn={isSignedIn} />}
      />
      <div className={classes.pageHeader}>
        <div className={classes.main}>
          {renderEditProfileModal()}
          <GridContainer justify="center">
            <GridItem xs={12}>
              {renderProfile()}
            </GridItem>
            <GridItem xs={12}>
              <div className={classes.tournamentHead}>
                <h3>Your Tournaments</h3>
                <div>
                  <Button color="primary">
                    Join a Tournament
                  </Button>
                  <Button color="primary" style={{ marginLeft: 20 }}>
                    Create a Tournament
                  </Button>
                </div>
              </div>
            </GridItem>
            <GridItem xs={12}>
              {renderTournaments()}
            </GridItem>
          </GridContainer>
        </div>
        <Footer />
      </div>
    </div>
  );
}
