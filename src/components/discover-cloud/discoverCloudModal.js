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

const DiscoverCloudModal = ({ closeModal, text, header, handleGoToCloud }) => {
  return (
    <Modal backdrop={false}>
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

export default DiscoverCloudModal
