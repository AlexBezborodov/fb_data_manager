import React, { useState, useEffect, useContext } from "react";

import {
  MenuOutlined,
  CloseOutlined,
  ApartmentOutlined,
  UsergroupAddOutlined,
  MailOutlined,
  MessageOutlined,
  UnorderedListOutlined,
  GroupOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, message } from "antd";
import axios from "axios";
import { Outlet, useLocation, useNavigate, useMatch } from "react-router-dom";

import { CurrentUserContext } from "../../providers/current_user";
import { getUniqueList } from "../../utils/utils";
import { BASIC_DB_URL, CONFIG } from "../../variables";
const { Sider, Content } = Layout;

export const MainPage = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const isMembers = !!useMatch("/main/members");

  const [collapsed, setCollapsed] = useState(false);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const fetchUserData = async (userId) => {
    await axios.get(`${BASIC_DB_URL}/users/user${userId}.json`).then((res) => {
      if (res.status === 200) {
        setCurrentUser(res.data);
        getCurrentPlan(res.data.planInfo);
      }
    });
  };

  const updateUserData = async (updLists, userId) => {
    const updatedData = {
      ...currentUser,
      lists: updLists,
    };
    await axios
      .patch(`${BASIC_DB_URL}/users/user${userId}.json`, updatedData, CONFIG)
      .then((res) => {
        if (res.status === 200) {
          setCurrentUser(res.data);
        }
      });
  };
  const getCurrentPlan = (currentPlan) => {
    axios
      .get(`${BASIC_DB_URL}/plans/${currentPlan.userPlan.toLowerCase()}.json`)
      .then((res) => {
        if (res.data) {
          localStorage.setItem("currentPlan", JSON.stringify(res.data));
          checkUserPlan(res.data, currentPlan);
        }
      })
      .catch((err) => {});
  };

  const checkUserPlan = (plan, userPlan) => {
    if (new Date(userPlan.expiredData).getTime() < new Date().getTime()) {
      message.error("Your current plan has expired. Please update your plan");
      setTimeout(() => {
        navigate("/update-plan");
      }, 1500);
    } else {
      if (userPlan.scrapCounter >= plan.usersAmount) {
        message.error("You have reached the limit of saved users");
      }
      if (userPlan.sentMessages >= plan.wMessages) {
        message.error("You have reached the limit of welcome messages");
      }
    }
  };

  const autoAddUserTOListByTag = async () => {
    const newMembers = await currentUser?.scrappedData;
    const lists = await currentUser?.lists;
    let updatedLists = null;
    if (!!newMembers && !!lists) {
      updatedLists = lists.map((list) => {
        const currentListTags = list?.tags
          ? list?.tags?.map((item) => item.toLowerCase())
          : [];
        const targetMembers = newMembers?.filter((member) => {
          const lowerCaseDetails = member?.basicInfo?.map((item) =>
            item.toLowerCase()
          );
          const includesTag = currentListTags?.some((tag) => {
            if (lowerCaseDetails.toString().includes(tag.toLowerCase())) {
              return true;
            } else {
              return false;
            }
          });
          if (includesTag) return member;
        });
        if (targetMembers?.length) {
          list.data = getUniqueList(
            [...list.data, ...transformData(targetMembers)],
            "profileLink"
          );
          // list.data = [...list.data, ...transformData(targetMembers)];
          return list;
        } else {
          return list;
        }
      });
    } else {
      updatedLists = lists;
    }

    updateUserData(updatedLists, currentUser.userId);
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchUserData(userId);
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId && isMembers) {
      fetchUserData(userId);
      autoAddUserTOListByTag(currentUser);
    }
  }, [isMembers]);

  return (
    <Layout
      style={{
        width: "100%",
        height: "100%",
        minHeight: "100vh",
      }}
    >
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ paddingTop: collapsed ? 40 : 0 }}
        theme="light"
      >
        {!collapsed && <div style={{ margin: 15 }}>FB GROUP@</div>}

        <Button
          style={{
            position: "absolute",
            top: 8,
            right: collapsed ? "31%" : 8,
          }}
          icon={!collapsed ? <CloseOutlined /> : <MenuOutlined />}
          onClick={() => setCollapsed(!collapsed)}
        />
        <Menu
          theme="light"
          mode="inline"
          style={{ overflowY: "auto" }}
          defaultSelectedKeys={[pathname.match(/([^/]*)\/*$/)[1]]}
          items={[
            {
              key: "integrations",
              icon: <ApartmentOutlined />,
              label: "Integrations",
              onClick: () => navigate("/main/integrations"),
            },
            {
              key: "members",
              icon: <UsergroupAddOutlined />,
              label: "Members",
              onClick: () => navigate("/main/members"),
            },
            {
              key: "welcome-message",
              icon: <MessageOutlined />,
              label: "Welcome message",
              onClick: () => navigate("/main/welcome-message"),
            },
            {
              key: "emails",
              icon: <MailOutlined />,
              label: "Emails",
              onClick: () => navigate("/main/emails"),
            },
            {
              key: "lists",
              icon: <UnorderedListOutlined />,
              label: "Lists",
              onClick: () => navigate("/main/lists"),
            },
            {
              key: "groups",
              icon: <GroupOutlined />,
              label: "Groups",
              onClick: () => navigate("/main/groups"),
            },
            {
              key: "settings",
              icon: <SettingOutlined />,
              label: "Settings",
              onClick: () => navigate("/main/settings"),
            },
          ]}
        />
        <div
          style={{
            width: collapsed ? 40 : 180,
            margin: "0 auto",
          }}
        >
          <Button
            type="primary"
            icon={<LogoutOutlined />}
            style={{ width: "100%" }}
            danger
            onClick={handleLogout}
          >
            {!collapsed && "LogOut"}
          </Button>
        </div>
      </Sider>
      <Layout className="site-layout">
        <Content
          style={{
            padding: 10,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

function transformData(userData) {
  if (userData) {
    return userData.map((item, i) => ({
      key: item.id,
      avatar: item.avatarUrl,
      name: item.user,
      q1: item?.questions[0]?.question,
      a1: item?.questions[0]?.answer,
      q2: item?.questions[1]?.question,
      a2: item?.questions[1]?.answer,
      q3: item?.questions[2]?.question,
      a3: item?.questions[2]?.answer,
      profileLink: item.profileLink,
      fbUserId: item?.profileId,
      details: item?.basicInfo ? item.basicInfo?.toString() : "",
    }));
  }
}
