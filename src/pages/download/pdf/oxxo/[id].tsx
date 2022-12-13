//React
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
//Components
import Home from "../../../index";
//Services
import { downloadPDF } from '../../../../services/referenceService';
//Extras
import useDownloader from 'react-use-downloader';

const DownloadReferenceOxxo     = () => {
    const router                = useRouter();
    const { id }                = router.query;
    const { download }          = useDownloader();

    const init                  = async () => {
       if(id && (typeof id == 'string')) {
        const response          = await downloadPDF(id);

        if(response && response.ok) {
            download(response.url, 'oxxo.pdf')
        }
        
        router.push("/");
       }
    }

    useEffect(() => {
        init();
    }, [id]);

    return <Home />;
}

export default DownloadReferenceOxxo;