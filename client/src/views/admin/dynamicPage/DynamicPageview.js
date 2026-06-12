import { AddIcon, ChevronDownIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  GridItem,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import CabinetRecordActions from "components/cabinet/CabinetRecordActions";
import Spinner from "components/spinner/Spinner";
import { useCallback, useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useParams, useLocation } from "react-router-dom";
import { toast as _toast } from "react-toastify";
import { getApi } from "services/api";
import CustomView from "utils/customView";
import { FaFilePdf } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import moment from "moment";

const View = () => {
  const param = useParams();

  const [data, setData] = useState();
  const { onOpen } = useDisclosure();
  const [, setEdit] = useState(false);
  const [isLoding, setIsLoding] = useState(false);
  const location = useLocation();
  const module = location.state.module;

  const pathName = (name) => {
    return `/${name.toLowerCase().replace(/ /g, "-")}`;
  };

  const fetchData = useCallback(async () => {
    if (param.id) {
      try {
        setIsLoding(true);
        let response = await getApi(`api/form/view/${param.id}?moduleId=${module._id}`);
        setData(response?.data?.data);
      } catch (e) {
        // Console statement removed
      } finally {
        setIsLoding(false);
      }
    }
  }, [module._id, param.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const generatePDF = () => {
    const element = document.getElementById("reports");
    if (element) {
      element.style.display = "block";
      element.style.width = "100%"; // Adjust width for mobile
      element.style.height = "auto";
      html2pdf()
        .from(element)
        .set({
          margin: [0, 0, 0, 0],
          filename: `${module.moduleName}_Details_${moment().format("DD-MM-YYYY")}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, allowTaint: true },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        })
        .save()
        .then(() => {
          element.style.display = "";
        });
      // }, 500);
    } else {
      // Console statement removed
    }
  };

  return (
    <>
      {isLoding ? (
        <Flex justifyContent={"center"} alignItems={"center"} width="100%">
          <Spinner />
        </Flex>
      ) : (
        <>
          <GridItem colSpan={{ base: 12, md: 6 }} mt={{ sm: "3px", md: "5px" }}>
            <Flex justifyContent={"right"}>
              <Menu>
                <MenuButton
                  size="sm"
                  variant="outline"
                  colorScheme="blackAlpha"
                  mr={2.5}
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                >
                  Actions
                </MenuButton>
                <MenuDivider />
                <MenuList minWidth={2}>
                  <MenuItem
                    color={"blue"}
                    onClick={() => onOpen()}
                    alignItems={"start"}
                    icon={<AddIcon />}
                  >
                    Add
                  </MenuItem>
                  <MenuItem onClick={() => setEdit(true)} alignItems={"start"} icon={<EditIcon />}>
                    Edit
                  </MenuItem>
                  <MenuItem
                    onClick={generatePDF}
                    alignItems={"start"}
                    icon={<FaFilePdf />}
                    display={"flex"}
                    style={{ alignItems: "center" }}
                  >
                    Print as PDF
                  </MenuItem>
                </MenuList>
              </Menu>
              <Link to={pathName(module.moduleName)}>
                <Button leftIcon={<IoIosArrowBack />} size="sm" variant="brand">
                  Back
                </Button>
              </Link>
            </Flex>
          </GridItem>
          <Box style={{ margin: "10px 0" }}>
            <CustomView data={module} fieldData={data} id="reports" />
          </Box>
          <Card mt={3}>
            <CabinetRecordActions showDelete={false} onEdit={() => setEdit(true)} />
          </Card>
        </>
      )}
    </>
  );
};

export default View;
