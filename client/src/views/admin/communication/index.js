import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import Card from "components/card/Card";
import React from "react";
import Email from "./components/email";
import Call from "./components/call";
import TextMsg from "./components/TextMsg";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <Tabs>
        <TabList sx={{ "& button:focus": { boxShadow: "none" } }}>
          <Tab>{t("modules.communication.email")}</Tab>
          <Tab>{t("modules.communication.call")}</Tab>
          <Tab>{t("modules.communication.textMsg")}</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Card>
              <Email />
            </Card>
          </TabPanel>
          <TabPanel>
            <Card>
              <Call />
            </Card>
          </TabPanel>
          <TabPanel>
            <Card>
              <TextMsg />
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default Index;
