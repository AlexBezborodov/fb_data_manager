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
import { Layout, Menu, Button } from "antd";
import axios from "axios";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { CurrentUserContext } from "../../providers/current_user";
import { BASIC_DB_URL } from "../../variables";
const { Sider, Content } = Layout;

export const MainPage = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setCurrentUser } = useContext(CurrentUserContext);

  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const fetchUserData = (userId) => {
    axios.get(`${BASIC_DB_URL}/users/user${userId}.json`).then((res) => {
      if (res.status === 200) {
        setCurrentUser(res.data);
      }
    });
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchUserData(userId);
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <Layout
      style={{
        width: "100%",
        height: "100vh",
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
