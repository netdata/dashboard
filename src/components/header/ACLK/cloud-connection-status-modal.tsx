import React, { useCallback } from "react"
import GoToCloud from "components/auth/signIn"

import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text,
  Flex,
  H3,
  Button,
  Box,
  ModalCloseButton,
} from "@netdata/netdata-ui"

import { ConnectionModalStatusContent } from "./types"

const campaign = "agent_nudge_to_cloud"

export type CloudConnectionStatusModalProps = ConnectionModalStatusContent & {
  closeModal: () => void
  onRefresh?: () => void
  isCTA1Disabled: boolean
}

const CloudConnectionStatusModal = ({
  title,
  text,
  CTA1,
  closeModal,
  onRefresh,
  isCTA1Disabled,
}: CloudConnectionStatusModalProps) => {
  const handleClickedCTA1 = useCallback(
    ({ link }: { link: string }) => {
      closeModal()
      window.open(link, "_blank")
    },
    [closeModal]
  )

  return (
    <Modal>
      <ModalContent width={180} background="modalBackground">
        <ModalHeader>
          <H3 margin={[0]}>{title}</H3>
          <ModalCloseButton onClose={closeModal} />
        </ModalHeader>
        <ModalBody>
          <Flex padding={[0, 0, 4, 0]} column gap={3}>
            {text.header({})}
            {text.bullets.length > 0 && (
              <Flex column gap={3}>
                <Flex column gap={1} as={"ul"}>
                  {text.bullets.map((bullet, index) => {
                    if (typeof bullet === "function") {
                      return <li key={index}> {bullet()}</li>
                    }
                    return (
                      <li key={bullet}>
                        <Text>{bullet}</Text>
                      </li>
                    )
                  })}
                </Flex>
              </Flex>
            )}
            {text.footer()}
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Box data-testid="cta1" margin={[0, 2, 0, 0]} width={{ min: 40 }}>
            <GoToCloud utmParameters={{ content: "connection_to_cloud", campaign }}>
              {({ link }) => (
                <Button
                  data-ga={`connection-to-cloud::click-ct1::ad`}
                  disabled={isCTA1Disabled}
                  textTransform="none"
                  data-testid="cta1-button"
                  onClick={() => handleClickedCTA1({ link })}
                  width="100%"
                  label={CTA1.text}
                />
              )}
            </GoToCloud>
          </Box>
          <Box
            data-ga={`connection-to-cloud::click-check-now::ad`}
            onClick={onRefresh}
            height={10}
            className="btn btn-default"
            data-testid="cta2-button"
            width={{ min: 40 }}
          >
            <Box as={Text} sx={{ fontWeight: "500", lineHeight: "25px" }}>
              Check Now
            </Box>
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default CloudConnectionStatusModal
