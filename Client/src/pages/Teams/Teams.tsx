import { Button, Typography } from '@mui/material';
import TeamsList from '../../components/HomePage/TeamsList';
import CreateTeamCard from '../../components/CreateTeamCard';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { getUserTeams } from '../../store/actions/userInfo';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';

interface Team {
  slogan: string;
  team_name: string;
  members: string[];
  exp: number;
  level: number;
  rank_points: number;
  rank_tier: number;
  registration_date: {
    _seconds: number;
    _nanoseconds: number;
  };
  mmr: number;
}

const Teams = () => {
  const [showTeamCard, setShowTeamCard] = useState(false);
  const [openTeam, setOpenTeam] = useState(-1);
  const [userTeams, setUserTeams] = useState<Team[]>([]);

  const handleShowTeamCard = () => {
    setShowTeamCard(true);
  };

  const handleTeamToggle = (index: number) => {
    setOpenTeam(openTeam === index ? -1 : index);
  };

  const handleAddTeam = (newTeam: Team) => {
    setUserTeams(prevTeams => [...prevTeams, newTeam]);
  };

  const handleCloseshowTeamCard = () => {
    setShowTeamCard(false);
  };

  const authState = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const jwtToken = authState.user.token;
    dispatch<any>(getUserTeams({ jwtToken }))
      .unwrap()
      .then((responseData: any) => {
        setUserTeams(responseData);
      })
      .catch((error: any) => {
        console.error('Failed to fetch user teams:', error);
      });
  }, [authState.user.token, dispatch]);

  return (
    <div style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '3rem',
      padding: '3rem 6rem',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Typography
          variant="h2"
          sx={{
            color: 'white',
            fontWeight: '500',
          }}
        >
          My Teams
        </Typography>

        <Button
          variant="contained"
          size="large"
          sx={{
            fontSize: '1.5rem',
            textTransform: 'capitalize',
            backgroundColor: '#3f51b5',
            color: 'white',
            borderRadius: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',

            '&:hover': {
              backgroundColor: '#303f9f',
            },
          }}
          onClick={handleShowTeamCard}
          disableRipple
          disableElevation
        >
          <GroupAddOutlinedIcon
            sx={{
              fontSize: '2.5rem',
            }}
          />
          Create Team
        </Button>
      </div>
      <div style={userTeams.length > 0 ? {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(40rem, 1fr))',
          padding: '3rem 0',
          gap: '3rem',
          placeItems: 'center',
        } : {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {userTeams.length > 0 ? (
          userTeams.map((team, index) => (
            <TeamsList
              key={team.team_name}
              open={openTeam === index}
              onClick={() => handleTeamToggle(index)}
              team={team}
            />
          ))
        ) : (
          <Typography
            variant="h2"
            sx={{
              color: 'white',
            }}
          >
            No teams found
          </Typography>
        )}
      </div>
      {showTeamCard && (
        <CreateTeamCard
          open={true}
          onClose={handleCloseshowTeamCard}
          onTeamCreated={handleAddTeam}
        />
      )}
    </div>
  );
};
export default Teams;
