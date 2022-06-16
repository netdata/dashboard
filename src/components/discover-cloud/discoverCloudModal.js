import React from "react"
import {
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

const DiscoverCloudModal = ({ closeModal, text, header, handleGoToCloud, image }) => {
  return (
    <Modal backdrop={false}>
      <ModalContent background="modalBackground">
        <ModalHeader>
          <H3 margin={[0]}>{header}</H3>
          <ModalCloseButton onClose={closeModal} />
        </ModalHeader>
        <ModalBody>
          <Flex column width={230} height={130}>
            <Flex padding={[0, 0, 4, 0]} column gap={3}>
              {text()}
            </Flex>
            <Flex overflow="hidden">
              {image && <Box as="img" width="100%" height="100%" src={image}></Box>}
            </Flex>
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
                  label="Signin to Netdata Cloud!"
                />
              )}
            </GoToCloud>
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default DiscoverCloudModal
