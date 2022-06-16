import React, { useState } from "react"
import {
  Text,
  Flex,
  Button,
  Box,
  H3,
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalCloseButton,
} from "@netdata/netdata-ui"
import GoToCloud from "components/auth/signIn"

import { callAll } from "@/src/utils/utils"

const Wrapper = Flex
const InnerPostioner = Flex
const ButtonWrapper = Box

const ButtonTabs = {
  Home: {
    label: "Home",
    header: "You are viewing the Home Tab",
    text: "Here we will display the functionallity of the home",
  },
  Overview: {
    label: "Overview",
    header: "You are viewing the Overview Tab",
    text: "Here we will display the functionallity of the Overview",
  },
  Nodes: {
    label: "Nodes",
    header: "You are viewing the Nodes Tab",
    text: "Here we will display the functionallity of the Nodes",
  },
  Dashboards: {
    label: "Dashboards",
    header: "You are viewing the Dashboards Tab",
    text: "Here we will display the functionallity of the Dashboards",
  },
  Alerts: {
    label: "Alerts",
    header: "You are viewing the Alerts Tab",
    text: "Here we will display the functionallity of the Alerts",
  },
  Anomaly: {
    label: "Anomaly",
    header: "You are viewing the Anomaly Tab",
    text: "Here we will display the functionallity of the Anomaly",
  },
  Pricing: {
    label: "Pricing",
    header: "You are viewing the Pricing Tab",
    text: "Here we will display the functionallity of the Pricing",
  },
  Privacy: {
    label: "Privacy",
    header: "You are viewing the Privacy Tab",
    text: "Here we will display the functionallity of the Privacy",
  },
}

const DiscoverCloudModal = ({ closeModal, text, header, handleGoToCloud }) => {
  return (
    <Modal>
      <ModalContent width={180} background="modalBackground">
        <ModalHeader>
          <H3 margin={[0]}>{header}</H3>
          <ModalCloseButton onClose={closeModal} />
        </ModalHeader>
        <ModalBody>
          <Flex padding={[0, 0, 4, 0]} column gap={3}>
            {text}
          </Flex>
          <Flex justifyContent="center" alignItems="center" height={50}>
            <H3>Here will be the image or video</H3>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Box data-testid="go-to-cloud-cta" margin={[0, 2, 0, 0]} width={{ min: 40 }}>
            <GoToCloud utmParameters={{ content: "cloud-tabs", campaign: "agent-go-to-cloud" }}>
              {({ link }) => (
                <Button
                  data-ga={"go-to-cloud-button"}
                  textTransform="none"
                  data-testid="cta1-button"
                  onClick={() => handleGoToCloud({ link })}
                  width="100%"
                  label={"Go to Cloud"}
                />
              )}
            </GoToCloud>
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

const DiscoverCloud = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [seletedModalContent, setSelectedModalContent] = useState(null)

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleGoToCloud = ({ link }) => {
    window.location.href = link
  }

  const handleSetModalContent = content => {
    setSelectedModalContent(content)
  }
  const handleResetModalContent = () => {
    setSelectedModalContent(null)
  }

  return (
    <Wrapper padding={[0, 0, 0, 4]} background={"panel"} position="relative" height={15}>
      <InnerPostioner
        padding={[4, 2, 4, 2]}
        gap={4}
        height="100%"
        justifyContent="center"
        alignItems="center"
      >
        <Text>Discover cloud functionalities:</Text>
        {Object.keys(ButtonTabs).map(key => {
          const { label } = ButtonTabs[key]
          return (
            <ButtonWrapper
              key={key}
              onClick={callAll(handleOpenModal, () => handleSetModalContent(ButtonTabs[key]))}
            >
              <Button label={label} />
            </ButtonWrapper>
          )
        })}
      </InnerPostioner>
      {isModalOpen && seletedModalContent && (
        <DiscoverCloudModal
          {...seletedModalContent}
          closeModal={callAll(handleCloseModal, handleResetModalContent)}
          handleGoToCloud={handleGoToCloud}
        />
      )}
    </Wrapper>
  )
}

export default DiscoverCloud
