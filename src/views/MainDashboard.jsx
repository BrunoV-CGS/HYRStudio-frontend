import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {createTheme} from "@mui/material/styles";
import {AppProvider} from "@toolpad/core/AppProvider";
import {DashboardLayout} from "@toolpad/core/DashboardLayout";
import {useDemoRouter} from "@toolpad/core/internal";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import {useState} from "react";
import {RiRobot3Fill} from "react-icons/ri";
import {LuScanText} from "react-icons/lu";
import {PiListMagnifyingGlassBold} from "react-icons/pi";
import {TiUploadOutline} from "react-icons/ti";
import {HiUsers} from "react-icons/hi2";
import {IoIosImages} from "react-icons/io";
import {MdAddBusiness} from "react-icons/md";
import ContentRequestForm from "../components/ContentRequestForm";
import GeneratedContent from "../components/GeneratedContent";
import ReviewedContent from "../components/ReviewedContent";
import HYR_Studio_logo from "../assets/HYR_Studio_logo.png";
import UpdateBaseModal from "../components/UpdateBaseModal";
import SidebarButton from "../components/SidebarButton";
import useUserLoginStore from "../hooks/useUserLoginStore";
import Users from "../components/Users";
import Companies from "../components/Companies";
import ImagesRequest from "../components/ImagesRequest";

const NAVIGATION = [
  {
    segment: "content-creation",
    title: "Content Creation",
    icon: <RiRobot3Fill className='text-2xl' />,
    children: [
      {
        segment: "requests",
        title: "Post Request",
        icon: <LuScanText className='text-2xl' />,
      },
      {
        segment: "images",
        title: "Image Request",
        icon: <IoIosImages className='text-2xl' />,
      },
      {
        segment: "review",
        title: "To Review",
        icon: <PiListMagnifyingGlassBold className='text-2xl' />,
      },
    ],
  },
  {
    segment: "mixpost",
    title: "Upload to Mixpost",
    icon: <TiUploadOutline className='text-2xl' />,
  },
];

const Theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#32205f",
          color: "#FFFFFF",
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          color: "#FFFFFF",
        },
      },
    },
  },
});

function ContentPage({pathname}) {
  let content;

  switch (pathname) {
    case "/content-creation/requests":
      content = (
        <Box className='w-full px-5'>
          <ContentRequestForm />
          <Grid container spacing={2} mt={2}>
            <Grid item xs={6}>
              <Skeleton variant='rounded' height={120} />
            </Grid>
            <Grid item xs={6}>
              <Skeleton variant='rounded' height={120} />
            </Grid>
          </Grid>
        </Box>
      );
      break;
    case "/content-creation/images":
      content = (
        <Box className='w-full px-5'>
          <ImagesRequest/>
        </Box>
      );
      break;

    case "/content-creation/review":
      content = (
        <Box className='w-full text-left px-5'>
          <Typography variant='h6' mb={2}>
            Generated Content
          </Typography>
          <GeneratedContent />
        </Box>
      );
      break;

    case "/mixpost":
      content = (
        <Box className='w-full text-left px-5'>
          <Typography variant='h6' mb={2}>
            Mixpost Integration
          </Typography>
          <ReviewedContent />
        </Box>
      );
      break;
    case "/users":
      content = (
        <Box className='w-full text-left px-5'>
          <Typography variant='h6' mb={2}>
            <Users />
          </Typography>
        </Box>
      );
      break;
    case "/companies":
      content = (
        <Box className='w-full text-left px-5'>
          <Typography variant='h6' mb={2}>
            <Companies />
          </Typography>
        </Box>
      );
      break;

    default:
      content = (
        <Box className='w-full px-5'>
          <Typography variant='h6'>Welcome to Content Catalyst</Typography>
        </Box>
      );
      break;
  }

  return (
    <Box
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {content}
    </Box>
  );
}

ContentPage.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function MainDashboard({window}) {
  const router = useDemoRouter("/content-creation/requests");
  const demoWindow = window ? window() : undefined;
  const {getUserRole} = useUserLoginStore();
  const userRole = getUserRole();

  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const filteredNavigation = [...NAVIGATION];

  if (userRole === "admin") {
    filteredNavigation.push(
      {kind: "divider"},
      {
        segment: "users",
        title: "Manage Users",
        icon: <HiUsers className='text-2xl' />,
      },
      {
        segment: "companies",
        title: "Manage Companies",
        icon: <MdAddBusiness className='text-2xl' />,
      }
    );
  }

  return (
    <AppProvider
      navigation={filteredNavigation}
      router={router}
      theme={Theme}
      branding={{
        title: "",
        logo: (
          <img
            src={HYR_Studio_logo}
            alt='HYR Studio Logo'
            style={{height: 40}}
          />
        ),
      }}
      window={demoWindow}
    >
      <DashboardLayout
        slots={{sidebarFooter: SidebarButton}}
        slotProps={{sidebarFooter: {handleOpenModal, handleCloseModal}}}
      >
        <ContentPage pathname={router.pathname} />
        <UpdateBaseModal open={modalOpen} handleClose={handleCloseModal} />
      </DashboardLayout>
    </AppProvider>
  );
}

MainDashboard.propTypes = {
  window: PropTypes.func,
};

export default MainDashboard;
