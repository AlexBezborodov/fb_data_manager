import React, { useState, useEffect } from "react";

import {
  MenuOutlined,
  CloseOutlined,
  ApartmentOutlined,
  UsergroupAddOutlined,
  MailOutlined,
  ToolOutlined,
  UnorderedListOutlined,
  GroupOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
const { Sider, Content } = Layout;

export const MainPage = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    const isLogged = localStorage.getItem("currentUser");
    !isLogged && navigate("/login");
  }, [pathname]);

  return (
    <Layout style={{ width: "100%", height: "100%" }}>
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
          defaultSelectedKeys={["integrations"]}
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
              key: "emails",
              icon: <MailOutlined />,
              label: "Emails",
              onClick: () => navigate("/main/emails"),
            },
            {
              key: "customize",
              icon: <ToolOutlined />,
              label: "Customize",
              onClick: () => navigate("/main/customize"),
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
            margin: "10px",
            padding: 10,
            minHeight: 350,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
